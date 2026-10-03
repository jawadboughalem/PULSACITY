import { eq } from "drizzle-orm";
import { render } from "react-email";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { Database } from "@/db/database";
import { customers, products, purchases, reviewRequests, spaces } from "@/db/schema";
import { insertTestSpace, insertTestUser } from "@/db/space-fixtures";
import { createTestDatabase, emptyTestDatabase } from "@/db/test-database";
import type { CustomerEmail } from "@/lib/email/send-email";
import { MAX_FAILED_ATTEMPTS, sendDueReviewEmails, sendFirstRequest, loadRequestToSend } from "./send-review-emails";
import { unsubscribeCustomer } from "./unsubscribe-customer";
import { readUnsubscribeToken } from "./unsubscribe-token";

vi.mock("@sentry/nextjs", () => ({ captureException: vi.fn() }));

const DAY_MS = 24 * 60 * 60 * 1000;
const NOW = new Date("2026-10-15T09:00:00Z");

let database: Database;
let spaceId: string;
let productId: string;
let sent: CustomerEmail[];

const send = async (email: CustomerEmail) => {
  sent.push(email);
};

const run = (now = NOW, options: { send?: (email: CustomerEmail) => Promise<void> } = {}) =>
  sendDueReviewEmails(database, { now, send: options.send ?? send, minIntervalMs: 0 });

let customerCount = 0;

const insertRequest = async (
  values: Partial<typeof reviewRequests.$inferInsert> = {},
  customer: Partial<typeof customers.$inferInsert> = {},
) => {
  customerCount += 1;
  const [{ id: customerId }] = await database
    .insert(customers)
    .values({ spaceId, email: `client-${customerCount}@exemple.fr`, firstName: "Camille", ...customer })
    .returning({ id: customers.id });
  const [{ id: purchaseId }] = await database
    .insert(purchases)
    .values({
      spaceId,
      customerId,
      productId,
      source: "connector",
      eventType: "sale",
      purchasedAt: new Date("2026-08-28T10:00:00Z"),
    })
    .returning({ id: purchases.id });
  const [request] = await database
    .insert(reviewRequests)
    .values({ purchaseId, token: `jeton-${customerCount}`, scheduledAt: new Date(NOW.getTime() - DAY_MS), ...values })
    .returning();
  return { ...request, customerId };
};

const readRequest = async (id: string) => {
  const [request] = await database.select().from(reviewRequests).where(eq(reviewRequests.id, id));
  return request;
};

beforeAll(async () => {
  database = await createTestDatabase();
});

beforeEach(async () => {
  vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://pulsacity.com");
  vi.stubEnv("BETTER_AUTH_SECRET", "un-secret-de-test-assez-long-pour-signer");
  await emptyTestDatabase(database);
  sent = [];
  const userId = await insertTestUser(database, "julie@exemple.fr");
  spaceId = await insertTestSpace(database, userId, "julie-nutrition");
  await database
    .update(spaces)
    .set({ name: "Julie Nutrition", replyToEmail: "julie@exemple.fr" })
    .where(eq(spaces.id, spaceId));
  const [product] = await database
    .insert(products)
    .values({ spaceId, name: "Programme 30 jours", slug: "programme-30-jours" })
    .returning({ id: products.id });
  productId = product.id;
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("sendDueReviewEmails", () => {
  it("sends the due request in the creator's name, with the personal link and the way out", async () => {
    const request = await insertRequest();
    await insertRequest({ scheduledAt: new Date(NOW.getTime() + DAY_MS) });

    expect(await run()).toMatchObject({ sent: 1, reminded: 0 });

    expect(sent).toHaveLength(1);
    const [email] = sent;
    expect(email).toMatchObject({
      to: "client-1@exemple.fr",
      subject: "Camille, votre avis sur Programme 30 jours\u00a0?",
      spaceName: "Julie Nutrition",
      replyTo: "julie@exemple.fr",
      idempotencyKey: `review-request/${request.id}/request`,
    });
    const text = await render(email.body, { plainText: true });
    expect(text).toContain("https://pulsacity.com/t/julie-nutrition/programme-30-jours?r=jeton-1");
    expect(text).toContain("Donner mon avis (1 minute)");
    expect(text).toContain("vous avez acheté Programme 30 jours auprès de Julie Nutrition le 28 août 2026");
    expect(email.unsubscribeUrl).toMatch(/^https:\/\/pulsacity\.com\/api\/unsubscribe\?token=/);
    const token = new URL(email.unsubscribeUrl).searchParams.get("token");
    expect(readUnsubscribeToken(token)).toBe(request.customerId);

    expect(await readRequest(request.id)).toMatchObject({
      status: "sent",
      sentAt: NOW,
      reminderScheduledAt: new Date(NOW.getTime() + 4 * DAY_MS),
    });
  });

  it("never sends the same request twice, even when two runs overlap", async () => {
    await insertRequest();
    await Promise.all([run(), run()]);
    await run();
    expect(sent).toHaveLength(1);
  });

  it("sends the one reminder four days later, if the customer has not answered", async () => {
    const request = await insertRequest();
    const answered = await insertRequest();
    await run();
    await database.update(reviewRequests).set({ status: "completed" }).where(eq(reviewRequests.id, answered.id));

    expect(await run(new Date(NOW.getTime() + 3 * DAY_MS))).toMatchObject({ reminded: 0 });
    expect(await run(new Date(NOW.getTime() + 4 * DAY_MS))).toMatchObject({ reminded: 1 });
    await run(new Date(NOW.getTime() + 9 * DAY_MS));

    expect(sent.map((email) => email.subject)).toEqual([
      "Camille, votre avis sur Programme 30 jours\u00a0?",
      "Camille, votre avis sur Programme 30 jours\u00a0?",
      "Camille, une minute pour Programme 30 jours\u00a0?",
    ]);
    expect(sent[2].idempotencyKey).toBe(`review-request/${request.id}/reminder`);
    expect(await render(sent[2].body, { plainText: true })).toContain("C'est le dernier message à ce sujet.");
    expect(await readRequest(request.id)).toMatchObject({ status: "reminded" });
  });

  it("stops at the plan's monthly requests, and sends the rest next month", async () => {
    for (let index = 0; index < 22; index += 1) await insertRequest();

    expect(await run()).toMatchObject({ sent: 20, spacesAtPlanLimit: 1 });
    expect(await run(new Date(NOW.getTime() + 60 * 1000))).toMatchObject({ sent: 0, spacesAtPlanLimit: 1 });
    expect(await run(new Date("2026-11-01T08:00:00Z"))).toMatchObject({ sent: 2 });
  });

  it("does not let a space past its limit hold up the requests of another space", async () => {
    for (let index = 0; index < 45; index += 1) {
      await insertRequest({ scheduledAt: new Date(NOW.getTime() - 2 * DAY_MS) });
    }
    const marcId = await insertTestUser(database, "marc@exemple.fr");
    const marcSpaceId = await insertTestSpace(database, marcId, "marc-coaching");
    const [marcProduct] = await database
      .insert(products)
      .values({ spaceId: marcSpaceId, name: "Coaching", slug: "coaching" })
      .returning({ id: products.id });
    const [marcCustomer] = await database
      .insert(customers)
      .values({ spaceId: marcSpaceId, email: "client-de-marc@exemple.fr" })
      .returning({ id: customers.id });
    const [marcPurchase] = await database
      .insert(purchases)
      .values({ spaceId: marcSpaceId, customerId: marcCustomer.id, productId: marcProduct.id, source: "manual", purchasedAt: NOW })
      .returning({ id: purchases.id });
    await database
      .insert(reviewRequests)
      .values({ purchaseId: marcPurchase.id, token: "jeton-de-marc", scheduledAt: new Date(NOW.getTime() - DAY_MS) });

    expect(await run()).toMatchObject({ sent: 21 });
    expect(sent.filter((email) => email.to === "client-de-marc@exemple.fr")).toHaveLength(1);
  });

  it("does not count the plan's limit on Essentiel", async () => {
    await database.update(spaces).set({ plan: "essentiel" }).where(eq(spaces.id, spaceId));
    for (let index = 0; index < 22; index += 1) await insertRequest();
    expect(await run()).toMatchObject({ sent: 22 });
  });

  it("cancels the request of an unsubscribed customer, or of an offer whose requests were turned off", async () => {
    const unsubscribed = await insertRequest({}, { unsubscribedAt: new Date("2026-10-01T00:00:00Z") });
    const turnedOff = await insertRequest();
    await database.update(products).set({ requestsEnabled: false });

    expect(await run()).toMatchObject({ sent: 0, cancelled: 2 });
    expect(sent).toEqual([]);
    expect((await readRequest(unsubscribed.id)).status).toBe("cancelled");
    expect((await readRequest(turnedOff.id)).status).toBe("cancelled");
  });

  it("gives a failed send back, then stops after three failures", async () => {
    const request = await insertRequest();
    const failing = async () => {
      throw new Error("Resend is down");
    };

    for (let attempt = 1; attempt < MAX_FAILED_ATTEMPTS; attempt += 1) {
      expect(await run(NOW, { send: failing })).toMatchObject({ failed: 1 });
      expect(await readRequest(request.id)).toMatchObject({ status: "scheduled", sentAt: null, failedAttempts: attempt });
    }
    await run(NOW, { send: failing });
    expect(await readRequest(request.id)).toMatchObject({ status: "failed", failedAttempts: MAX_FAILED_ATTEMPTS });
    expect(await run()).toMatchObject({ sent: 0 });

    const loaded = await loadRequestToSend(database, request.id);
    expect(await sendFirstRequest(database, loaded!, 0, { now: NOW, send })).toBe("sent");
    expect(await readRequest(request.id)).toMatchObject({ status: "sent", failedAttempts: 0 });
  });

  it("writes to a customer without a first name", async () => {
    await insertRequest({}, { firstName: null });
    await run();
    expect(sent[0].subject).toBe("Votre avis sur Programme 30 jours\u00a0?");
    expect(await render(sent[0].body, { plainText: true })).toContain("Bonjour,");
  });
});

describe("unsubscribeCustomer", () => {
  it("cancels what was planned and drops the reminder, but keeps the link of a request already sent", async () => {
    const planned = await insertRequest();
    const sentRequest = await insertRequest(
      { status: "sent", sentAt: NOW, reminderScheduledAt: new Date(NOW.getTime() + 4 * DAY_MS) },
      { email: "client-2@exemple.fr" },
    );
    await database
      .update(purchases)
      .set({ customerId: planned.customerId })
      .where(eq(purchases.id, sentRequest.purchaseId));

    expect(await unsubscribeCustomer(database, planned.customerId, NOW)).toMatchObject({ spaceName: "Julie Nutrition" });

    expect(await readRequest(planned.id)).toMatchObject({ status: "cancelled" });
    expect(await readRequest(sentRequest.id)).toMatchObject({ status: "sent", reminderScheduledAt: null });
    await run(new Date(NOW.getTime() + 10 * DAY_MS));
    expect(sent).toEqual([]);
  });

  it("keeps the first date of unsubscription", async () => {
    const request = await insertRequest();
    await unsubscribeCustomer(database, request.customerId, NOW);
    await unsubscribeCustomer(database, request.customerId, new Date(NOW.getTime() + DAY_MS));
    const [customer] = await database.select().from(customers).where(eq(customers.id, request.customerId));
    expect(customer.unsubscribedAt).toEqual(NOW);
  });
});
