import { describe, expect, it } from "vitest";
import { readEffectivePlan, readSubscriptionSnapshot } from "./read-subscription-snapshot";
import { FOUNDER_ESSENTIEL_MONTHLY, buildSchedule, buildStripePrice, buildSubscription } from "./stripe-fixtures";

const SPACE_ID = "6f1c2d3e-4a5b-4c6d-8e9f-0a1b2c3d4e5f";
const PERIOD_END = new Date("2026-11-12T10:00:00Z");

describe("readSubscriptionSnapshot", () => {
  it("reads the plan, the period and the founder price from the price's lookup key", () => {
    const snapshot = readSubscriptionSnapshot(buildSubscription({ spaceId: SPACE_ID, periodEnd: PERIOD_END }));
    expect(snapshot).toMatchObject({
      id: "sub_test",
      customerId: "cus_test",
      spaceId: SPACE_ID,
      status: "active",
      plan: "essentiel",
      period: "monthly",
      priceList: "founder",
      amountCents: 999,
      currentPeriodEnd: PERIOD_END,
      cancelAt: null,
      scheduled: null,
      betaTester: false,
      card: { brand: "visa", last4: "4242" },
    });
  });

  it("ignores a subscription to a price PULSACITY does not sell", () => {
    const subscription = buildSubscription();
    subscription.items.data[0].price = buildStripePrice(FOUNDER_ESSENTIEL_MONTHLY, { lookup_key: "autre_chose" });
    expect(readSubscriptionSnapshot(subscription)).toBeNull();
  });

  it("refuses a space id that is not one", () => {
    const subscription = buildSubscription();
    subscription.metadata = { space_id: "julie" };
    expect(readSubscriptionSnapshot(subscription)?.spaceId).toBeNull();
  });

  it("reads a stop at the end of the period (« Votre plan Essentiel s'arrête le … »)", () => {
    const snapshot = readSubscriptionSnapshot(buildSubscription({ cancelAtPeriodEnd: true, periodEnd: PERIOD_END }));
    expect(snapshot?.cancelAt).toEqual(PERIOD_END);
  });

  it("reads the beta testers' coupon, and when the offered months end", () => {
    const betaUntil = new Date("2027-01-12T10:00:00Z");
    expect(readSubscriptionSnapshot(buildSubscription({ betaUntil }))).toMatchObject({ betaTester: true, betaUntil });
  });

  it("reads the change programmed for the end of the period", () => {
    const pro = { plan: "pro", period: "monthly", priceList: "founder" } as const;
    const schedule = buildSchedule({ current: pro, next: FOUNDER_ESSENTIEL_MONTHLY, at: PERIOD_END });
    const snapshot = readSubscriptionSnapshot(buildSubscription({ key: pro, schedule, periodEnd: PERIOD_END }));
    expect(snapshot?.scheduled).toEqual({ ...FOUNDER_ESSENTIEL_MONTHLY, amountCents: 999, at: PERIOD_END });
  });

  it("reads the payment refused while it is retried", () => {
    const refusedAt = new Date("2026-10-12T10:00:00Z");
    const snapshot = readSubscriptionSnapshot(
      buildSubscription({
        status: "past_due",
        latestInvoice: { status: "open", attempt_count: 1, amount_due: 999, created: refusedAt.getTime() / 1000 },
      }),
    );
    expect(snapshot?.lastPaymentFailed).toEqual({ at: refusedAt, amountCents: 999 });
  });

  it("forgets a stop or a change once the subscription is over", () => {
    const endedAt = new Date("2026-11-12T10:00:00Z");
    const snapshot = readSubscriptionSnapshot(buildSubscription({ status: "canceled", cancelAtPeriodEnd: true, endedAt }));
    expect(snapshot).toMatchObject({ cancelAt: null, scheduled: null, endedAt });
  });
});

describe("readEffectivePlan", () => {
  it("keeps the plan while it is paid or retried, the free plan otherwise", () => {
    expect(readEffectivePlan({ status: "active", plan: "pro" })).toBe("pro");
    expect(readEffectivePlan({ status: "trialing", plan: "pro" })).toBe("pro");
    expect(readEffectivePlan({ status: "past_due", plan: "essentiel" })).toBe("essentiel");
    for (const status of ["incomplete", "incomplete_expired", "canceled", "unpaid", "paused"]) {
      expect(readEffectivePlan({ status, plan: "essentiel" })).toBe("free");
    }
  });
});
