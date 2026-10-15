import type Stripe from "stripe";
import { describe, expect, it, vi } from "vitest";
import type { Database } from "@/db/database";
import { buildStripePrice, buildSubscription } from "./stripe-fixtures";
import { type CurrentPlan, applyPlanChange, classifyPlanChange, previewPlanChange } from "./plan-change";

vi.mock("./apply-subscription", () => ({ syncSubscription: vi.fn().mockResolvedValue({ status: "applied" }) }));

const ESSENTIEL_MONTHLY: CurrentPlan = { plan: "essentiel", period: "monthly", priceList: "founder" };
const PRO_MONTHLY: CurrentPlan = { plan: "pro", period: "monthly", priceList: "founder" };

describe("classifyPlanChange", () => {
  it("opens Checkout for a free space choosing a paid plan", () => {
    expect(classifyPlanChange(null, { plan: "essentiel", period: "monthly" })).toBe("checkout");
    expect(classifyPlanChange(null, { plan: "free", period: "monthly" })).toBe("unchanged");
  });

  it("takes a higher plan at once, prorated, whatever the period", () => {
    expect(classifyPlanChange(ESSENTIEL_MONTHLY, { plan: "pro", period: "monthly" })).toBe("now");
    expect(classifyPlanChange(ESSENTIEL_MONTHLY, { plan: "pro", period: "yearly" })).toBe("now");
  });

  it("waits for the end of the period for a lower plan and for the other period", () => {
    expect(classifyPlanChange(PRO_MONTHLY, { plan: "essentiel", period: "monthly" })).toBe("at-period-end");
    expect(classifyPlanChange(ESSENTIEL_MONTHLY, { plan: "essentiel", period: "yearly" })).toBe("at-period-end");
    expect(classifyPlanChange({ ...ESSENTIEL_MONTHLY, period: "yearly" }, { plan: "essentiel", period: "monthly" })).toBe(
      "at-period-end",
    );
  });

  it("stops at the end of the period for the free plan, and changes nothing for the same plan", () => {
    expect(classifyPlanChange(PRO_MONTHLY, { plan: "free", period: "monthly" })).toBe("stop");
    expect(classifyPlanChange(PRO_MONTHLY, { plan: "pro", period: "monthly" })).toBe("unchanged");
  });
});

const PERIOD_END = new Date("2026-11-12T10:00:00Z");

const fakeStripe = ({ pendingUpdate = false }: { pendingUpdate?: boolean } = {}) => {
  const subscription = buildSubscription({ key: ESSENTIEL_MONTHLY, periodEnd: PERIOD_END });
  const prices = vi.fn(async ({ lookup_keys }: { lookup_keys: string[] }) => {
    const [plan, period, priceList] = lookup_keys[0].split("_") as ["essentiel" | "pro", "monthly" | "yearly", "founder" | "public"];
    return { data: [buildStripePrice({ plan, period, priceList })] };
  });
  const update = vi.fn().mockResolvedValue({
    ...subscription,
    pending_update: pendingUpdate ? { expires_at: 0 } : null,
    latest_invoice: { id: "in_proration", hosted_invoice_url: "https://invoice.stripe.com/i/test" },
  });
  const scheduleUpdate = vi.fn().mockResolvedValue({});
  const createSchedule = vi.fn().mockResolvedValue({
    id: "sub_sched_test",
    current_phase: { start_date: 1789000000, end_date: PERIOD_END.getTime() / 1000 },
    phases: [
      {
        start_date: 1789000000,
        end_date: PERIOD_END.getTime() / 1000,
        items: [{ price: "price_essentiel_monthly_founder", quantity: 1 }],
        discounts: [{ coupon: null, discount: "di_beta", promotion_code: null }],
      },
    ],
  });
  const createPreview = vi.fn().mockResolvedValue({ amount_due: 1000 });
  const stripe = {
    prices: { list: prices },
    subscriptions: { retrieve: vi.fn().mockResolvedValue(subscription), update },
    subscriptionSchedules: { create: createSchedule, update: scheduleUpdate, retrieve: vi.fn(), release: vi.fn() },
    invoices: { createPreview },
  } as unknown as Stripe;
  return { stripe, update, createSchedule, scheduleUpdate, createPreview };
};

const database = {} as Database;

describe("applyPlanChange", () => {
  it("moves up at once, prorated and charged now, keeping the founder price", async () => {
    const { stripe, update } = fakeStripe();
    const result = await applyPlanChange(database, stripe, "sub_test", ESSENTIEL_MONTHLY, { plan: "pro", period: "monthly" });
    expect(result.status).toBe("changed");
    expect(update).toHaveBeenCalledWith("sub_test", {
      items: [{ id: "si_sub_test", price: "price_pro_monthly_founder", quantity: 1 }],
      proration_behavior: "always_invoice",
      payment_behavior: "pending_if_incomplete",
      expand: ["latest_invoice"],
    });
  });

  it("sends the creator to Stripe's invoice when the bank asks for a confirmation", async () => {
    const { stripe } = fakeStripe({ pendingUpdate: true });
    await expect(
      applyPlanChange(database, stripe, "sub_test", ESSENTIEL_MONTHLY, { plan: "pro", period: "monthly" }),
    ).resolves.toEqual({ status: "needs-confirmation", url: "https://invoice.stripe.com/i/test" });
  });

  it("programs a lower plan or the other period for the end of the period, without proration", async () => {
    const { stripe, update, scheduleUpdate } = fakeStripe();
    await applyPlanChange(database, stripe, "sub_test", ESSENTIEL_MONTHLY, { plan: "essentiel", period: "yearly" });
    expect(update).not.toHaveBeenCalled();
    expect(scheduleUpdate).toHaveBeenCalledWith("sub_sched_test", {
      end_behavior: "release",
      proration_behavior: "none",
      phases: [
        {
          items: [{ price: "price_essentiel_monthly_founder", quantity: 1 }],
          discounts: [{ discount: "di_beta" }],
          start_date: 1789000000,
          end_date: PERIOD_END.getTime() / 1000,
          proration_behavior: "none",
        },
        {
          items: [{ price: "price_essentiel_yearly_founder", quantity: 1 }],
          duration: { interval: "year", interval_count: 1 },
          proration_behavior: "none",
        },
      ],
    });
  });
});

describe("previewPlanChange", () => {
  it("says what a higher plan costs today, from Stripe's preview", async () => {
    const { stripe, createPreview } = fakeStripe();
    await expect(
      previewPlanChange(stripe, "sub_test", ESSENTIEL_MONTHLY, { plan: "pro", period: "monthly" }),
    ).resolves.toEqual({ kind: "now", amountDueCents: 1000, nextAmountCents: 1999, periodEnd: PERIOD_END });
    expect(createPreview).toHaveBeenCalledWith(
      expect.objectContaining({ subscription_details: expect.objectContaining({ proration_behavior: "always_invoice" }) }),
    );
  });

  it("says when a lower plan comes, and its price", async () => {
    const { stripe, createPreview } = fakeStripe();
    await expect(
      previewPlanChange(stripe, "sub_test", PRO_MONTHLY, { plan: "essentiel", period: "monthly" }),
    ).resolves.toEqual({ kind: "at-period-end", nextAmountCents: 999, at: PERIOD_END });
    expect(createPreview).not.toHaveBeenCalled();
  });
});
