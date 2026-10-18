import { eq } from "drizzle-orm";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { Database } from "@/db/database";
import { subscriptions } from "@/db/schema";
import { insertTestSpace, insertTestUser } from "@/db/space-fixtures";
import { createTestDatabase, emptyTestDatabase } from "@/db/test-database";
import { sendDueBetaReminders } from "./beta-reminders";

let database: Database;
let spaceId: string;

const BETA_UNTIL = new Date("2027-01-12T10:00:00Z");
const DAY_MS = 24 * 60 * 60 * 1000;

const insertBetaSubscription = (values: Partial<typeof subscriptions.$inferInsert> = {}) =>
  database.insert(subscriptions).values({
    id: "sub_beta",
    spaceId,
    status: "active",
    plan: "essentiel",
    period: "monthly",
    priceList: "founder",
    amountCents: 999,
    betaTester: true,
    betaUntil: BETA_UNTIL,
    cardBrand: "visa",
    cardLast4: "4242",
    ...values,
  });

beforeAll(async () => {
  database = await createTestDatabase();
  vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://pulsacity.com");
});

beforeEach(async () => {
  await emptyTestDatabase(database);
  const userId = await insertTestUser(database, "julie@exemple.fr");
  spaceId = await insertTestSpace(database, userId, "julie-nutrition");
});

describe("sendDueBetaReminders", () => {
  it("writes once to a beta tester, 7 days before the first payment", async () => {
    await insertBetaSubscription();
    const send = vi.fn().mockResolvedValue(undefined);
    expect(await sendDueBetaReminders(database, { now: new Date(BETA_UNTIL.getTime() - 8 * DAY_MS), send })).toBe(0);
    const remindAt = new Date(BETA_UNTIL.getTime() - 7 * DAY_MS);
    expect(await sendDueBetaReminders(database, { now: remindAt, send })).toBe(1);
    expect(await sendDueBetaReminders(database, { now: new Date(remindAt.getTime() + DAY_MS), send })).toBe(0);
    expect(send).toHaveBeenCalledOnce();
    expect(send.mock.calls[0][0]).toMatchObject({
      to: "julie@exemple.fr",
      subject: "Votre plan Essentiel devient payant le 12 janvier",
    });
  });

  it("writes to nobody who stopped, nor once the first payment is past", async () => {
    await insertBetaSubscription({ cancelAt: BETA_UNTIL });
    const send = vi.fn();
    expect(await sendDueBetaReminders(database, { now: new Date(BETA_UNTIL.getTime() - 3 * DAY_MS), send })).toBe(0);
    await database.update(subscriptions).set({ cancelAt: null }).where(eq(subscriptions.id, "sub_beta"));
    expect(await sendDueBetaReminders(database, { now: new Date(BETA_UNTIL.getTime() + DAY_MS), send })).toBe(0);
    expect(send).not.toHaveBeenCalled();
  });

  it("gives the reminder back when the e-mail could not leave, for the next run", async () => {
    await insertBetaSubscription();
    const now = new Date(BETA_UNTIL.getTime() - 5 * DAY_MS);
    await expect(
      sendDueBetaReminders(database, { now, send: vi.fn().mockRejectedValue(new Error("Resend")) }),
    ).rejects.toThrow("Resend");
    expect(await sendDueBetaReminders(database, { now, send: vi.fn().mockResolvedValue(undefined) })).toBe(1);
  });
});
