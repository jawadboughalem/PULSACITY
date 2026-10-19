import { eq } from "drizzle-orm";
import { type Mock, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { Database } from "@/db/database";
import { connections, products, purchases, customers, reviewRequests, spaces, welcomeEmails } from "@/db/schema";
import { insertTestSpace, insertTestUser } from "@/db/space-fixtures";
import { createTestDatabase, emptyTestDatabase } from "@/db/test-database";
import { readWelcomeDueAt, sendDueWelcomeEmails, sendWelcomeEmail } from "./send-welcome-emails";

vi.mock("@sentry/nextjs", () => ({ captureException: vi.fn() }));

/** Monday 12 October 2026, 10:06 in Paris (maquette J0). */
const CREATED_AT = new Date("2026-10-12T08:06:00Z");
const J1_AT = new Date("2026-10-13T08:00:00Z");
const J3_AT = new Date("2026-10-15T08:00:00Z");
const J7_AT = new Date("2026-10-19T08:00:00Z");

let database: Database;
let send: Mock;
let spaceId: string;

beforeAll(async () => {
  database = await createTestDatabase();
});

beforeEach(async () => {
  await emptyTestDatabase(database);
  vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://pulsacity.com");
  vi.stubEnv("BETTER_AUTH_SECRET", "a-test-secret-of-at-least-32-characters");
  send = vi.fn().mockResolvedValue(undefined);
  spaceId = await insertTestSpace(database, await insertTestUser(database, "julie@exemple.fr"), "julie-nutrition");
  await database.update(spaces).set({ name: "Julie Nutrition", createdAt: CREATED_AT }).where(eq(spaces.id, spaceId));
});

afterEach(() => {
  vi.unstubAllEnvs();
});

const addOffer = () =>
  database.insert(products).values({ spaceId, name: "Programme 30 jours", slug: "programme-30-jours" });

const readRows = () => database.select().from(welcomeEmails).where(eq(welcomeEmails.spaceId, spaceId));

describe("readWelcomeDueAt", () => {
  it("sends J0 at the creation of the space, the others at 10 a.m. in Paris that many days later", () => {
    expect(readWelcomeDueAt("j0", CREATED_AT)).toEqual(CREATED_AT);
    expect(readWelcomeDueAt("j1", CREATED_AT)).toEqual(J1_AT);
    expect(readWelcomeDueAt("j3", CREATED_AT)).toEqual(J3_AT);
    expect(readWelcomeDueAt("j7", CREATED_AT)).toEqual(J7_AT);
    // 25 October: Paris goes back to winter time, 10 a.m. is 9 a.m. UTC from then on.
    expect(readWelcomeDueAt("j7", new Date("2026-10-22T08:00:00Z"))).toEqual(new Date("2026-10-29T09:00:00Z"));
  });

  it("counts the days in Paris: a space created just before midnight there gets J1 the next morning", () => {
    expect(readWelcomeDueAt("j1", new Date("2026-10-12T21:59:00Z"))).toEqual(J1_AT);
  });
});

describe("sendWelcomeEmail", () => {
  it("sends J0 to the creator, in PULSACITY's name, answers to contact@pulsacity.com, with a way out", async () => {
    expect(await sendWelcomeEmail(database, spaceId, "j0", { now: CREATED_AT, send })).toBe("sent");

    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "julie@exemple.fr",
        subject: "Votre espace Julie Nutrition est prêt",
        replyTo: "contact@pulsacity.com",
        unsubscribeUrl: expect.stringMatching(/^https:\/\/pulsacity\.com\/api\/unsubscribe\/accueil\?token=/),
        idempotencyKey: `welcome-${spaceId}-j0`,
      }),
    );
    expect(await readRows()).toEqual([expect.objectContaining({ step: "j0", sentAt: expect.any(Date), skippedAt: null })]);
  });

  it("never sends the same e-mail twice, even asked twice at once", async () => {
    const outcomes = await Promise.all([
      sendWelcomeEmail(database, spaceId, "j0", { now: CREATED_AT, send }),
      sendWelcomeEmail(database, spaceId, "j0", { now: CREATED_AT, send }),
    ]);

    expect(outcomes.sort()).toEqual(["already-handled", "sent"]);
    expect(send).toHaveBeenCalledTimes(1);
    expect(await sendWelcomeEmail(database, spaceId, "j0", { now: CREATED_AT, send })).toBe("already-handled");
  });

  it("stops an e-mail whose step is done: an offer created before J0 leaves", async () => {
    await addOffer();

    expect(await sendWelcomeEmail(database, spaceId, "j0", { now: CREATED_AT, send })).toBe("skipped");
    expect(send).not.toHaveBeenCalled();
    expect(await readRows()).toEqual([expect.objectContaining({ step: "j0", sentAt: null, skippedAt: CREATED_AT })]);
  });

  it("stops J1 once a tool is connected, J3 once a widget shows, J7 after a first request", async () => {
    const [connection] = await database
      .insert(connections)
      .values({ spaceId, connector: "systeme", webhookToken: "token-1", status: "active" })
      .returning({ id: connections.id });
    expect(await sendWelcomeEmail(database, spaceId, "j1", { now: J1_AT, send })).toBe("skipped");

    await database.update(spaces).set({ plan: "free" }).where(eq(spaces.id, spaceId));
    expect(await sendWelcomeEmail(database, spaceId, "j3", { now: J3_AT, send })).toBe("sent");

    const [offer] = await addOffer().returning({ id: products.id });
    const [customer] = await database
      .insert(customers)
      .values({ spaceId, email: "camille@exemple.fr" })
      .returning({ id: customers.id });
    const [purchase] = await database
      .insert(purchases)
      .values({
        spaceId,
        customerId: customer.id,
        productId: offer.id,
        connectionId: connection.id,
        source: "connector",
        purchasedAt: J3_AT,
      })
      .returning({ id: purchases.id });
    await database.insert(reviewRequests).values({ purchaseId: purchase.id, token: "request-1", scheduledAt: J7_AT });
    expect(await sendWelcomeEmail(database, spaceId, "j7", { now: J7_AT, send })).toBe("skipped");
    expect(send).toHaveBeenCalledTimes(1);
  });

  it("sends nothing before its time, nor long after it", async () => {
    expect(await sendWelcomeEmail(database, spaceId, "j1", { now: new Date(J1_AT.getTime() - 60_000), send })).toBe(
      "not-due",
    );
    expect(
      await sendWelcomeEmail(database, spaceId, "j1", { now: new Date(J1_AT.getTime() + 3 * 24 * 60 * 60 * 1000), send }),
    ).toBe("not-due");
    expect(send).not.toHaveBeenCalled();
  });

  it("sends nothing after « Ne plus recevoir les e-mails d'accueil »", async () => {
    await database.update(spaces).set({ welcomeEmailsUnsubscribedAt: CREATED_AT }).where(eq(spaces.id, spaceId));

    expect(await sendWelcomeEmail(database, spaceId, "j1", { now: J1_AT, send })).toBe("unsubscribed");
    expect(send).not.toHaveBeenCalled();
  });

  it("tries again at the next run when the e-mail could not leave", async () => {
    send.mockRejectedValueOnce(new Error("Resend is down"));

    await expect(sendWelcomeEmail(database, spaceId, "j1", { now: J1_AT, send })).rejects.toThrow("Resend is down");
    expect(await readRows()).toEqual([]);

    expect(await sendWelcomeEmail(database, spaceId, "j1", { now: J1_AT, send })).toBe("sent");
  });
});

describe("sendDueWelcomeEmails", () => {
  it("sends each space the e-mail of the day, skips those whose step is done, and leaves old spaces alone", async () => {
    const otherSpaceId = await insertTestSpace(database, await insertTestUser(database, "sophie@exemple.fr"), "atelier-sophie");
    await database.update(spaces).set({ createdAt: CREATED_AT }).where(eq(spaces.id, otherSpaceId));
    await database.insert(products).values({ spaceId: otherSpaceId, name: "Atelier", slug: "atelier" });
    const oldSpaceId = await insertTestSpace(database, await insertTestUser(database, "karim@exemple.fr"), "coaching-karim");
    await database.update(spaces).set({ createdAt: new Date("2026-09-01T08:00:00Z") }).where(eq(spaces.id, oldSpaceId));

    const summary = await sendDueWelcomeEmails(database, { now: CREATED_AT, send });

    expect(summary).toEqual({ welcomeEmailsSent: 1, welcomeEmailsSkipped: 1 });
    expect(send).toHaveBeenCalledWith(expect.objectContaining({ to: "julie@exemple.fr" }));

    // The next run, J0 handled for both, J1 not yet due: nothing.
    expect(await sendDueWelcomeEmails(database, { now: new Date(CREATED_AT.getTime() + 15 * 60_000), send })).toEqual({
      welcomeEmailsSent: 0,
      welcomeEmailsSkipped: 0,
    });

    // The next morning, J1 for both: neither has a connected tool.
    expect(await sendDueWelcomeEmails(database, { now: J1_AT, send })).toEqual({
      welcomeEmailsSent: 2,
      welcomeEmailsSkipped: 0,
    });
    expect(send).toHaveBeenCalledTimes(3);
  });
});
