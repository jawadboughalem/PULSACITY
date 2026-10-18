import { describe, expect, it } from "vitest";
import type { BillingOverview, CurrentSubscription } from "./billing-overview";
import { type BillingPageContext, chooseBillingBanner } from "./billing-page-state";

const NOW = new Date("2026-10-15T10:00:00Z");
const PERIOD_END = new Date("2026-11-12T10:00:00Z");

const subscription = (values: Partial<CurrentSubscription> = {}): CurrentSubscription => ({
  id: "sub_test",
  spaceId: "space",
  status: "active",
  plan: "essentiel",
  period: "monthly",
  priceList: "founder",
  amountCents: 999,
  currentPeriodEnd: PERIOD_END,
  cancelAt: null,
  endedAt: null,
  scheduledPlan: null,
  scheduledPeriod: null,
  scheduledPriceList: null,
  scheduledAmountCents: null,
  scheduledAt: null,
  betaTester: false,
  betaUntil: null,
  betaReminderSentAt: null,
  couponId: null,
  cardBrand: "visa",
  cardLast4: "4242",
  lastPaymentFailedAt: null,
  lastPaymentFailedAmountCents: null,
  createdAt: NOW,
  syncedAt: NOW,
  ...values,
});

const overview = (values: Partial<BillingOverview> = {}): BillingOverview => ({
  plan: "essentiel",
  subscription: subscription(),
  hasCustomer: true,
  freeSince: null,
  usage: { approvedTestimonials: 12, requestsThisMonth: 3, widgets: 1, pausedWidgets: 0, widgetsWithoutMention: 0 },
  priceList: "founder",
  ...values,
});

const context = (values: Partial<BillingPageContext> = {}): BillingPageContext => ({
  error: null,
  welcome: null,
  abandoned: null,
  displayedWidget: null,
  now: NOW,
  ...values,
});

describe("chooseBillingBanner", () => {
  it("says nothing on a plan that simply runs", () => {
    expect(chooseBillingBanner(overview(), context())).toBeNull();
  });

  it("welcomes back from Checkout (05), or says the payment is on its way (06)", () => {
    expect(chooseBillingBanner(overview(), context({ welcome: "checkout" }))).toEqual({ kind: "welcome", plan: "essentiel" });
    expect(chooseBillingBanner(overview({ plan: "free", subscription: subscription({ status: "incomplete" }) }), context())).toEqual({
      kind: "pending",
    });
    expect(chooseBillingBanner(overview({ plan: "free", subscription: null }), context({ welcome: "checkout" }))).toEqual({
      kind: "pending",
    });
  });

  it("thanks a beta tester rather than speak of a payment (04)", () => {
    const betaUntil = new Date("2027-01-12T10:00:00Z");
    expect(
      chooseBillingBanner(overview({ subscription: subscription({ betaTester: true, betaUntil }) }), context({ welcome: "checkout" })),
    ).toEqual({ kind: "beta", until: betaUntil });
  });

  it("puts a failed payment first (08)", () => {
    expect(
      chooseBillingBanner(overview({ subscription: subscription({ status: "past_due", cancelAt: PERIOD_END }) }), context()),
    ).toEqual({ kind: "failed", plan: "essentiel" });
  });

  it("says a stop (09) and a change (10) programmed", () => {
    expect(chooseBillingBanner(overview({ subscription: subscription({ cancelAt: PERIOD_END }) }), context())).toEqual({
      kind: "stopping",
      plan: "essentiel",
      at: PERIOD_END,
    });
    expect(
      chooseBillingBanner(
        overview({
          subscription: subscription({
            plan: "pro",
            amountCents: 1999,
            scheduledPlan: "essentiel",
            scheduledPeriod: "monthly",
            scheduledPriceList: "founder",
            scheduledAmountCents: 999,
            scheduledAt: PERIOD_END,
          }),
        }),
        context(),
      ),
    ).toEqual({
      kind: "scheduled",
      from: { plan: "pro", period: "monthly" },
      to: { plan: "essentiel", period: "monthly", amountCents: 999 },
      at: PERIOD_END,
    });
  });

  it("says a payment abandoned on Stripe (07), and the return to the free plan with widgets paused (11)", () => {
    const free = overview({ plan: "free", subscription: null });
    const choice = { plan: "essentiel", period: "monthly" } as const;
    expect(chooseBillingBanner(free, context({ abandoned: choice }))).toEqual({ kind: "abandoned", choice });
    const back = overview({
      plan: "free",
      subscription: null,
      freeSince: NOW,
      usage: { approvedTestimonials: 47, requestsThisMonth: 6, widgets: 3, pausedWidgets: 2, widgetsWithoutMention: 0 },
    });
    expect(chooseBillingBanner(back, context({ displayedWidget: "Mur · Programme 30 jours" }))).toEqual({
      kind: "back-to-free",
      since: NOW,
      displayedWidget: "Mur · Programme 30 jours",
      pausedWidgets: 2,
    });
  });

  it("says first what went wrong on the way to Stripe", () => {
    expect(chooseBillingBanner(overview(), context({ error: "portal" }))).toEqual({ kind: "error", error: "portal" });
  });
});
