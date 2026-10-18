import type Stripe from "stripe";
import {
  type BillingPeriod,
  type PaidPlanId,
  type PlanId,
  type PriceList,
  comparePlans,
  isPaidPlan,
} from "@/config/plans";
import type { Database } from "@/db/database";
import { type ApplySubscriptionResult, syncSubscription } from "./apply-subscription";
import { findStripePrice } from "./stripe-prices";

export type CurrentPlan = { plan: PaidPlanId; period: BillingPeriod; priceList: PriceList };

/** The plan of a subscription row, which is always a paid one. */
export const readCurrentPlan = (row: { plan: PlanId; period: BillingPeriod; priceList: PriceList }): CurrentPlan | null =>
  isPaidPlan(row.plan) ? { plan: row.plan, period: row.period, priceList: row.priceList } : null;

export type TargetPlan = { plan: PlanId; period: BillingPeriod };

/**
 * The rules of decisions/tarifs.md: a higher plan at once, prorated; a lower plan, the other period or the free plan
 * at the end of the period paid, without refund. Without a subscription, a paid plan goes through Checkout.
 */
export type PlanChangeKind = "checkout" | "now" | "at-period-end" | "stop" | "unchanged";

export const classifyPlanChange = (current: CurrentPlan | null, target: TargetPlan): PlanChangeKind => {
  if (!isPaidPlan(target.plan)) return current === null ? "unchanged" : "stop";
  if (current === null) return "checkout";
  if (current.plan === target.plan && current.period === target.period) return "unchanged";
  return comparePlans(current.plan, target.plan) > 0 ? "now" : "at-period-end";
};

const readId = (value: string | { id: string } | null | undefined): string | null =>
  value === null || value === undefined ? null : typeof value === "string" ? value : value.id;

const STRIPE_INTERVALS = { monthly: "month", yearly: "year" } as const;

const readItem = (subscription: Stripe.Subscription): Stripe.SubscriptionItem => {
  const item = subscription.items.data[0];
  if (item === undefined) throw new Error(`Subscription ${subscription.id} has no item`);
  return item;
};

/** A schedule programs a change; any other change starts by letting it go, so that only one change is ever pending. */
const releaseSchedule = async (stripe: Stripe, subscription: Stripe.Subscription): Promise<void> => {
  const scheduleId = readId(subscription.schedule);
  if (scheduleId === null) return;
  const schedule = await stripe.subscriptionSchedules.retrieve(scheduleId);
  if (schedule.status === "active" || schedule.status === "not_started") {
    await stripe.subscriptionSchedules.release(scheduleId);
  }
};

/** A stop programmed is lifted (« Reprendre mon abonnement »): the subscription goes on, at the same price. */
const liftStop = async (stripe: Stripe, subscription: Stripe.Subscription): Promise<void> => {
  if (subscription.cancel_at_period_end) {
    await stripe.subscriptions.update(subscription.id, { cancel_at_period_end: false });
  } else if (subscription.cancel_at !== null) {
    await stripe.subscriptions.update(subscription.id, { cancel_at: "" });
  }
};

export type PlanChangePreview =
  | { kind: "now"; amountDueCents: number; nextAmountCents: number; periodEnd: Date | null }
  | { kind: "at-period-end"; nextAmountCents: number; at: Date | null };

const describeTarget = (current: CurrentPlan, target: { plan: PaidPlanId; period: BillingPeriod }) => ({
  ...target,
  // The founder price stays with the space while its subscription lasts, whatever the plan (arbitrages.md, n° 1).
  priceList: current.priceList,
});

/** What the creator pays today for a higher plan, prorated, or what comes at the end of the period. */
export const previewPlanChange = async (
  stripe: Stripe,
  subscriptionId: string,
  current: CurrentPlan,
  target: { plan: PaidPlanId; period: BillingPeriod },
): Promise<PlanChangePreview> => {
  const price = await findStripePrice(stripe, describeTarget(current, target));
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const item = readItem(subscription);
  if (classifyPlanChange(current, target) !== "now") {
    return { kind: "at-period-end", nextAmountCents: price.unit_amount ?? 0, at: new Date(item.current_period_end * 1000) };
  }
  const preview = await stripe.invoices.createPreview({
    customer: readId(subscription.customer) ?? undefined,
    subscription: subscription.id,
    subscription_details: {
      items: [{ id: item.id, price: price.id, quantity: 1 }],
      proration_behavior: "always_invoice",
    },
  });
  return {
    kind: "now",
    amountDueCents: preview.amount_due,
    nextAmountCents: price.unit_amount ?? 0,
    periodEnd: target.period === current.period ? new Date(item.current_period_end * 1000) : null,
  };
};

export type ApplyPlanChangeResult =
  | { status: "changed"; sync: ApplySubscriptionResult }
  /** The bank asks for a confirmation (3D Secure): the creator finishes on Stripe's page of the invoice. */
  | { status: "needs-confirmation"; url: string }
  | { status: "unchanged" };

/** Changes the plan of a subscribed space, by the rules of classifyPlanChange, then reads the subscription again. */
export const applyPlanChange = async (
  database: Database,
  stripe: Stripe,
  subscriptionId: string,
  current: CurrentPlan,
  target: { plan: PaidPlanId; period: BillingPeriod },
): Promise<ApplyPlanChangeResult> => {
  const kind = classifyPlanChange(current, target);
  if (kind !== "now" && kind !== "at-period-end") return { status: "unchanged" };
  const price = await findStripePrice(stripe, describeTarget(current, target));
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  await releaseSchedule(stripe, subscription);
  await liftStop(stripe, subscription);
  const item = readItem(subscription);

  if (kind === "now") {
    const updated = await stripe.subscriptions.update(subscription.id, {
      items: [{ id: item.id, price: price.id, quantity: 1 }],
      proration_behavior: "always_invoice",
      payment_behavior: "pending_if_incomplete",
      expand: ["latest_invoice"],
    });
    const invoice = updated.latest_invoice;
    if (updated.pending_update !== null && invoice !== null && typeof invoice !== "string" && invoice.hosted_invoice_url) {
      return { status: "needs-confirmation", url: invoice.hosted_invoice_url };
    }
    return { status: "changed", sync: await syncSubscription(database, stripe, subscription.id) };
  }

  const schedule = await stripe.subscriptionSchedules.create({ from_subscription: subscription.id });
  const phase = schedule.phases.find((candidate) => candidate.start_date === schedule.current_phase?.start_date);
  if (phase === undefined) throw new Error(`Schedule ${schedule.id} has no current phase`);
  await stripe.subscriptionSchedules.update(schedule.id, {
    end_behavior: "release",
    proration_behavior: "none",
    phases: [
      {
        items: phase.items.map((phaseItem) => ({ price: readId(phaseItem.price) ?? price.id, quantity: phaseItem.quantity ?? 1 })),
        discounts: phase.discounts.map((discount) =>
          discount.discount !== null
            ? { discount: readId(discount.discount) ?? undefined }
            : { coupon: readId(discount.coupon) ?? undefined },
        ),
        start_date: phase.start_date,
        end_date: phase.end_date,
        proration_behavior: "none",
      },
      {
        items: [{ price: price.id, quantity: 1 }],
        duration: { interval: STRIPE_INTERVALS[target.period], interval_count: 1 },
        proration_behavior: "none",
      },
    ],
  });
  return { status: "changed", sync: await syncSubscription(database, stripe, subscription.id) };
};

/** « Annuler ce changement »: the change programmed for the end of the period is dropped. */
export const cancelScheduledChange = async (
  database: Database,
  stripe: Stripe,
  subscriptionId: string,
): Promise<ApplySubscriptionResult> => {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  await releaseSchedule(stripe, subscription);
  return syncSubscription(database, stripe, subscriptionId);
};

/** « Reprendre mon abonnement »: the stop programmed is lifted. */
export const resumeSubscription = async (
  database: Database,
  stripe: Stripe,
  subscriptionId: string,
): Promise<ApplySubscriptionResult> => {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  await liftStop(stripe, subscription);
  return syncSubscription(database, stripe, subscriptionId);
};

/** Before Stripe's page of cancellation: a change programmed would stop it, so it goes first. */
export const prepareStop = async (stripe: Stripe, subscriptionId: string): Promise<void> => {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  await releaseSchedule(stripe, subscription);
};
