import { eq } from "drizzle-orm";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { Database } from "@/db/database";
import { subscriptions } from "@/db/schema";
import { insertTestSpace, insertTestUser } from "@/db/space-fixtures";
import { createTestDatabase, emptyTestDatabase } from "@/db/test-database";
import { sendDueRenewalReminders } from "./renewal-reminders";

let database: Database;
let spaceId: string;

const RENEWAL_AT = new Date("2027-11-12T10:00:00Z");
const DAY_MS = 24 * 60 * 60 * 1000;
const daysBefore = (days: number) => new Date(RENEWAL_AT.getTime() - days * DAY_MS);

const insertYearlySubscription = (values: Partial<typeof subscriptions.$inferInsert> = {}) =>
  database.insert(subscriptions).values({
    id: "sub_yearly",
    spaceId,
    status: "active",
    plan: "essentiel",
    period: "yearly",
    priceList: "founder",
    amountCents: 9900,
    currentPeriodEnd: RENEWAL_AT,
    cardBrand: "visa",
    cardLast4: "4242",
    ...values,
  });

const sendNothing = () => vi.fn().mockResolvedValue(undefined);

beforeAll(async () => {
  database = await createTestDatabase();
  vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://pulsacity.com");
});

beforeEach(async () => {
  await emptyTestDatabase(database);
  const userId = await insertTestUser(database, "julie@exemple.fr");
  spaceId = await insertTestSpace(database, userId, "julie-nutrition");
});

describe("sendDueRenewalReminders", () => {
  it("writes once, 7 days before a yearly renewal (CGV 5.2)", async () => {
    await insertYearlySubscription();
    const send = sendNothing();
    expect(await sendDueRenewalReminders(database, { now: daysBefore(8), send })).toBe(0);
    expect(await sendDueRenewalReminders(database, { now: daysBefore(7), send })).toBe(1);
    expect(await sendDueRenewalReminders(database, { now: daysBefore(2), send })).toBe(0);
    expect(send).toHaveBeenCalledOnce();
    expect(send.mock.calls[0][0]).toMatchObject({
      to: "julie@exemple.fr",
      subject: "Votre abonnement annuel se renouvelle le 12 novembre",
      replyTo: "contact@pulsacity.com",
    });
  });

  it("writes again before the next year's renewal", async () => {
    await insertYearlySubscription();
    const send = sendNothing();
    expect(await sendDueRenewalReminders(database, { now: daysBefore(5), send })).toBe(1);
    const nextRenewal = new Date(RENEWAL_AT.getTime() + 365 * DAY_MS);
    await database.update(subscriptions).set({ currentPeriodEnd: nextRenewal }).where(eq(subscriptions.id, "sub_yearly"));
    expect(await sendDueRenewalReminders(database, { now: new Date(nextRenewal.getTime() - 6 * DAY_MS), send })).toBe(1);
    expect(send).toHaveBeenCalledTimes(2);
  });

  it("writes nothing before a monthly payment, a stop, a move to the monthly period or to the free plan", async () => {
    const send = vi.fn();
    for (const values of [
      { period: "monthly" as const, amountCents: 999 },
      { cancelAt: RENEWAL_AT },
      { scheduledPlan: "essentiel" as const, scheduledPeriod: "monthly" as const, scheduledAt: RENEWAL_AT },
      { scheduledPlan: "free" as const, scheduledAt: RENEWAL_AT },
      { status: "past_due" as const },
    ]) {
      await database.delete(subscriptions);
      await insertYearlySubscription(values);
      expect(await sendDueRenewalReminders(database, { now: daysBefore(3), send }), JSON.stringify(values)).toBe(0);
    }
    expect(send).not.toHaveBeenCalled();
  });

  it("announces the plan that renews when a change is programmed for the end of the year", async () => {
    await insertYearlySubscription({
      plan: "pro",
      amountCents: 19900,
      scheduledPlan: "essentiel",
      scheduledPeriod: "yearly",
      scheduledPriceList: "founder",
      scheduledAmountCents: 9900,
      scheduledAt: RENEWAL_AT,
    });
    const send = sendNothing();
    expect(await sendDueRenewalReminders(database, { now: daysBefore(4), send })).toBe(1);
    expect(send.mock.calls[0][0].body.props).toMatchObject({ plan: "essentiel", amountCents: 9900, priceList: "founder" });
  });

  it("gives the reminder back when the e-mail could not leave, for the next run", async () => {
    await insertYearlySubscription();
    const now = daysBefore(5);
    await expect(
      sendDueRenewalReminders(database, { now, send: vi.fn().mockRejectedValue(new Error("Resend")) }),
    ).rejects.toThrow("Resend");
    expect(await sendDueRenewalReminders(database, { now, send: sendNothing() })).toBe(1);
  });
});
