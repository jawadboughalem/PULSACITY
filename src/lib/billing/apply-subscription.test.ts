import { eq } from "drizzle-orm";
import type Stripe from "stripe";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { FOUNDER_PRICE_SEATS } from "@/config/plans";
import type { Database } from "@/db/database";
import { billingPayments, founderSeats, spaces, stripeEvents, subscriptions } from "@/db/schema";
import { insertTestSpace, insertTestUser } from "@/db/space-fixtures";
import { createTestDatabase, emptyTestDatabase } from "@/db/test-database";
import { applySubscription } from "./apply-subscription";
import { countFounderSeats, readCurrentPriceList } from "./founder-seats";
import { FOUNDER_ESSENTIEL_MONTHLY, buildEvent, buildInvoice, buildSchedule, buildSubscription } from "./stripe-fixtures";
import { listEventsToReplay, processStripeEvent, recordStripeEvent } from "./stripe-events";

vi.mock("@/lib/email/send-email", () => ({ sendAccountEmail: vi.fn() }));

let database: Database;
let spaceId: string;

const NOW = new Date("2026-10-12T10:00:00Z");
const PERIOD_END = new Date("2026-11-12T10:00:00Z");

const readSpace = async () => {
  const [space] = await database.select().from(spaces).where(eq(spaces.id, spaceId));
  return space;
};

const readSubscriptionRow = async (id = "sub_test") => {
  const [row] = await database.select().from(subscriptions).where(eq(subscriptions.id, id));
  return row;
};

const apply = (fixture: Parameters<typeof buildSubscription>[0] = {}) =>
  applySubscription(database, buildSubscription({ spaceId, periodEnd: PERIOD_END, ...fixture }), NOW);

beforeAll(async () => {
  database = await createTestDatabase();
});

beforeEach(async () => {
  await emptyTestDatabase(database);
  const userId = await insertTestUser(database, "julie@exemple.fr");
  spaceId = await insertTestSpace(database, userId, "julie-nutrition");
});

describe("applySubscription", () => {
  it("creation: the space takes its plan, its Stripe ids, and a founder seat", async () => {
    const result = await apply();
    expect(result).toEqual({
      status: "applied",
      spaceId,
      plan: "essentiel",
      previousPlan: "free",
      closedFounderPrice: false,
    });
    expect(await readSpace()).toMatchObject({
      plan: "essentiel",
      stripeCustomerId: "cus_test",
      stripeSubscriptionId: "sub_test",
      freeSince: null,
    });
    expect(await readSubscriptionRow()).toMatchObject({
      status: "active",
      plan: "essentiel",
      period: "monthly",
      priceList: "founder",
      amountCents: 999,
      currentPeriodEnd: PERIOD_END,
      cardBrand: "visa",
      cardLast4: "4242",
    });
    expect(await countFounderSeats(database)).toBe(1);
  });

  it("finds the space by its Stripe customer when the metadata is missing", async () => {
    await database.update(spaces).set({ stripeCustomerId: "cus_test" }).where(eq(spaces.id, spaceId));
    await applySubscription(database, buildSubscription({ spaceId: null }), NOW);
    expect((await readSpace()).plan).toBe("essentiel");
  });

  it("renewal: the next period is written, nothing else changes, the seat is taken once", async () => {
    await apply();
    const nextEnd = new Date("2026-12-12T10:00:00Z");
    await apply({ periodEnd: nextEnd });
    expect((await readSubscriptionRow()).currentPeriodEnd).toEqual(nextEnd);
    expect(await countFounderSeats(database)).toBe(1);
  });

  it("the same state twice changes nothing (an event received twice, or replayed)", async () => {
    await apply();
    const before = await readSubscriptionRow();
    await apply();
    expect(await readSubscriptionRow()).toEqual({ ...before, syncedAt: NOW });
    expect(await countFounderSeats(database)).toBe(1);
  });

  it("failed payment: the plan stays while Stripe retries, the refused payment is kept", async () => {
    await apply();
    await apply({
      status: "past_due",
      latestInvoice: { status: "open", attempt_count: 1, amount_due: 999, created: NOW.getTime() / 1000 },
    });
    expect((await readSpace()).plan).toBe("essentiel");
    expect(await readSubscriptionRow()).toMatchObject({
      status: "past_due",
      lastPaymentFailedAt: NOW,
      lastPaymentFailedAmountCents: 999,
    });
  });

  it("stop programmed, then over: the space goes back to the free plan, nothing deleted", async () => {
    await apply();
    await apply({ cancelAtPeriodEnd: true });
    expect((await readSubscriptionRow()).cancelAt).toEqual(PERIOD_END);
    expect((await readSpace()).plan).toBe("essentiel");

    await apply({ status: "canceled", endedAt: PERIOD_END });
    expect(await readSpace()).toMatchObject({ plan: "free", stripeSubscriptionId: null, freeSince: PERIOD_END });
    expect(await readSubscriptionRow()).toMatchObject({ status: "canceled", cancelAt: null, endedAt: PERIOD_END });
  });

  it("change of plan: a higher plan applies at once, a lower one is programmed, then applies", async () => {
    await apply();
    const pro = { ...FOUNDER_ESSENTIEL_MONTHLY, plan: "pro" } as const;
    await apply({ key: pro });
    expect((await readSpace()).plan).toBe("pro");

    await apply({ key: pro, schedule: buildSchedule({ current: pro, next: FOUNDER_ESSENTIEL_MONTHLY, at: PERIOD_END }) });
    expect(await readSubscriptionRow()).toMatchObject({
      plan: "pro",
      scheduledPlan: "essentiel",
      scheduledPeriod: "monthly",
      scheduledPriceList: "founder",
      scheduledAmountCents: 999,
      scheduledAt: PERIOD_END,
    });

    await apply({ key: FOUNDER_ESSENTIEL_MONTHLY });
    expect((await readSpace()).plan).toBe("essentiel");
    expect((await readSubscriptionRow()).scheduledPlan).toBeNull();
  });

  it("promotion code of the beta testers: no founder seat, beta tester for good", async () => {
    const betaUntil = new Date("2027-01-12T10:00:00Z");
    await apply({ betaUntil });
    expect(await readSubscriptionRow()).toMatchObject({ betaTester: true, betaUntil });
    expect(await countFounderSeats(database)).toBe(0);

    // The offered months over, the discount is gone from Stripe: the space stays a beta tester, its date kept.
    await apply();
    expect(await readSubscriptionRow()).toMatchObject({ betaTester: true, betaUntil });
    expect(await countFounderSeats(database)).toBe(0);
  });

  it("keeps the coupon of a partner's promotion code once its discount is over", async () => {
    await apply({ couponId: "partenaire-marie-coach" });
    expect(await readSubscriptionRow()).toMatchObject({ couponId: "partenaire-marie-coach" });

    await apply();
    expect(await readSubscriptionRow()).toMatchObject({ couponId: "partenaire-marie-coach" });
  });

  it("founder price: the hundredth seat closes it, for the pages and the next subscribers", async () => {
    await database.insert(founderSeats).values(Array.from({ length: FOUNDER_PRICE_SEATS - 1 }, () => ({ spaceId: null })));
    expect(await readCurrentPriceList(database)).toBe("founder");
    const result = await apply();
    expect(result).toMatchObject({ status: "applied", closedFounderPrice: true });
    expect(await readCurrentPriceList(database)).toBe("public");
  });

  it("a public price takes no seat", async () => {
    await apply({ key: { ...FOUNDER_ESSENTIEL_MONTHLY, priceList: "public" } });
    expect(await countFounderSeats(database)).toBe(0);
  });

  it("first payment on its way: the subscription is current, the plan waits", async () => {
    await apply({ status: "incomplete" });
    expect(await readSpace()).toMatchObject({ plan: "free", stripeSubscriptionId: "sub_test" });
    await apply({ status: "incomplete_expired" });
    expect(await readSpace()).toMatchObject({ plan: "free", stripeSubscriptionId: null, freeSince: null });
  });

  it("keeps apart an old subscription, over, when the space has another one", async () => {
    await apply({ id: "sub_new" });
    const result = await apply({ id: "sub_old", status: "canceled", endedAt: NOW });
    expect(result).toEqual({ status: "kept-apart", spaceId });
    expect(await readSpace()).toMatchObject({ plan: "essentiel", stripeSubscriptionId: "sub_new" });
  });

  it("ignores a subscription without a space, or to a price PULSACITY does not sell", async () => {
    await expect(
      applySubscription(database, buildSubscription({ spaceId: null, customer: "cus_unknown" }), NOW),
    ).resolves.toEqual({ status: "no-space" });
    const foreign = buildSubscription({ spaceId });
    foreign.items.data[0].price.lookup_key = null;
    await expect(applySubscription(database, foreign, NOW)).resolves.toEqual({ status: "not-pulsacity" });
    expect((await readSpace()).plan).toBe("free");
  });
});

describe("Stripe events", () => {
  const fakeStripe = (subscription: Stripe.Subscription) =>
    ({ subscriptions: { retrieve: vi.fn().mockResolvedValue(subscription) } }) as unknown as Stripe;

  it("keeps an event once, and processes it once", async () => {
    const subscription = buildSubscription({ spaceId });
    const event = buildEvent("customer.subscription.created", subscription);
    expect(await recordStripeEvent(database, event)).toBe("new");
    expect(await recordStripeEvent(database, event)).toBe("duplicate");

    const stripe = fakeStripe(subscription);
    const outcome = await processStripeEvent(database, stripe, event.id, NOW);
    expect(outcome).toMatchObject({ status: "processed", subscription: { status: "applied", plan: "essentiel" } });
    await expect(processStripeEvent(database, stripe, event.id, NOW)).resolves.toEqual({ status: "already-processed" });
    expect(stripe.subscriptions.retrieve).toHaveBeenCalledOnce();
  });

  it("reads the subscription again from Stripe, whatever the event says", async () => {
    // The event is older than what Stripe says now: the space follows Stripe.
    const event = buildEvent("customer.subscription.updated", buildSubscription({ spaceId, status: "past_due" }));
    await recordStripeEvent(database, event);
    await processStripeEvent(database, fakeStripe(buildSubscription({ spaceId })), event.id, NOW);
    expect((await readSubscriptionRow()).status).toBe("active");
  });

  it("keeps every paid invoice with money for the threshold of the micro-entreprise, once", async () => {
    const event = buildEvent("invoice.paid", buildInvoice({ spaceId, amountPaid: 999 }));
    await recordStripeEvent(database, event);
    await processStripeEvent(database, fakeStripe(buildSubscription({ spaceId })), event.id, NOW);
    const free = buildEvent("invoice.paid", buildInvoice({ id: "in_free", spaceId, amountPaid: 0 }), "evt_free");
    await recordStripeEvent(database, free);
    await processStripeEvent(database, fakeStripe(buildSubscription({ spaceId })), free.id, NOW);
    expect(await database.select().from(billingPayments)).toEqual([
      {
        id: "in_test",
        spaceId,
        subscriptionId: "sub_test",
        amountCents: 999,
        currency: "eur",
        paidAt: new Date("2026-10-12T10:00:00Z"),
      },
    ]);
  });

  it("finds the subscription of a checkout session, an invoice, a schedule, a customer", async () => {
    await apply();
    const stripe = fakeStripe(buildSubscription({ spaceId }));
    const events = [
      buildEvent("checkout.session.completed", { object: "checkout.session", mode: "subscription", subscription: "sub_test" }),
      buildEvent("invoice.payment_failed", buildInvoice({ status: "open" })),
      buildEvent("subscription_schedule.released", { object: "subscription_schedule", subscription: "sub_test" }),
      buildEvent("customer.updated", { object: "customer", id: "cus_test" }),
      buildEvent("payment_method.attached", { object: "payment_method", customer: "cus_test" }),
    ];
    for (const event of events) {
      await recordStripeEvent(database, event);
      await processStripeEvent(database, stripe, event.id, NOW);
    }
    expect(stripe.subscriptions.retrieve).toHaveBeenCalledTimes(events.length);
  });

  it("keeps the error of a failed processing, and replays it later from the cron task", async () => {
    const event = buildEvent("customer.subscription.updated", buildSubscription({ spaceId }));
    await recordStripeEvent(database, event);
    await database
      .update(stripeEvents)
      .set({ receivedAt: new Date(NOW.getTime() - 10 * 60 * 1000) })
      .where(eq(stripeEvents.id, event.id));
    const unreachable = {
      subscriptions: { retrieve: vi.fn().mockRejectedValue(new Error("Stripe unreachable")) },
    } as unknown as Stripe;
    await expect(processStripeEvent(database, unreachable, event.id, NOW)).rejects.toThrow("Stripe unreachable");
    const [kept] = await database.select().from(stripeEvents).where(eq(stripeEvents.id, event.id));
    expect(kept).toMatchObject({ processedAt: null, error: "Stripe unreachable" });

    expect(await listEventsToReplay(database, NOW)).toEqual([event.id]);
    await processStripeEvent(database, fakeStripe(buildSubscription({ spaceId })), event.id, NOW);
    expect(await listEventsToReplay(database, NOW)).toEqual([]);
  });
});
