import type Stripe from "stripe";
import type { BillingPeriod, PaidPlanId, PlanId, PriceList, StripePriceKey } from "@/config/plans";
import { readStripePriceKey } from "./stripe-prices";

/** The coupon of the beta testers (prompt 4 of the recette): Essentiel offered 3 months, then the founder price. */
export const BETA_COUPON_ID = "beta-essentiel-3-mois";

/** What PULSACITY reads of a subscription: retrieve it with these, so that one call says everything. */
export const SUBSCRIPTION_EXPANSIONS = [
  "default_payment_method",
  "latest_invoice",
  "discounts",
  "schedule.phases.items.price",
  "customer.invoice_settings.default_payment_method",
];

export type ScheduledChange = {
  plan: PaidPlanId;
  period: BillingPeriod;
  priceList: PriceList;
  amountCents: number;
  at: Date;
};

export type SubscriptionSnapshot = {
  id: string;
  customerId: string;
  /** The space named by Checkout in the subscription's metadata; null for a subscription made elsewhere. */
  spaceId: string | null;
  status: string;
  plan: PaidPlanId;
  period: BillingPeriod;
  priceList: PriceList;
  amountCents: number;
  currentPeriodEnd: Date | null;
  cancelAt: Date | null;
  endedAt: Date | null;
  scheduled: ScheduledChange | null;
  betaTester: boolean;
  betaUntil: Date | null;
  card: { brand: string; last4: string } | null;
  lastPaymentFailed: { at: Date; amountCents: number } | null;
};

/** The statuses that keep the plan: paid, or a payment being retried (« Mettez à jour votre carte pour garder … »). */
const PLAN_KEEPING_STATUSES = new Set(["active", "trialing", "past_due"]);

/** The statuses of a subscription that is over: the space goes back to the free plan. */
const ENDED_STATUSES = new Set(["canceled", "incomplete_expired"]);

export const keepsPlan = (status: string): boolean => PLAN_KEEPING_STATUSES.has(status);

export const isSubscriptionOver = (status: string): boolean => ENDED_STATUSES.has(status);

/** The plan a space has with this subscription: its own while it is paid or retried, the free plan otherwise. */
export const readEffectivePlan = (snapshot: Pick<SubscriptionSnapshot, "status" | "plan">): PlanId =>
  keepsPlan(snapshot.status) ? snapshot.plan : "free";

const toDate = (seconds: number | null | undefined): Date | null =>
  seconds === null || seconds === undefined ? null : new Date(seconds * 1000);

const readId = (value: string | { id: string } | null | undefined): string | null =>
  value === null || value === undefined ? null : typeof value === "string" ? value : value.id;

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const readSpaceId = (metadata: Stripe.Metadata | null | undefined): string | null => {
  const spaceId = metadata?.space_id;
  return spaceId !== undefined && UUID_PATTERN.test(spaceId) ? spaceId.toLowerCase() : null;
};

const readCard = (paymentMethod: string | Stripe.PaymentMethod | null | undefined) =>
  paymentMethod !== null && paymentMethod !== undefined && typeof paymentMethod !== "string" && paymentMethod.card
    ? { brand: paymentMethod.card.brand, last4: paymentMethod.card.last4 }
    : null;

const readCustomerCard = (customer: Stripe.Subscription["customer"]) =>
  typeof customer === "string" || customer.deleted ? null : readCard(customer.invoice_settings.default_payment_method);

const readBetaDiscount = (discounts: Stripe.Subscription["discounts"]): Stripe.Discount | null =>
  discounts.find(
    (discount): discount is Stripe.Discount =>
      typeof discount !== "string" && readId(discount.source.coupon) === BETA_COUPON_ID,
  ) ?? null;

const readLastPaymentFailed = (
  status: string,
  invoice: Stripe.Subscription["latest_invoice"],
): SubscriptionSnapshot["lastPaymentFailed"] => {
  if (status !== "past_due" && status !== "unpaid") return null;
  if (invoice === null || typeof invoice === "string" || invoice.status !== "open" || invoice.attempt_count === 0) {
    return null;
  }
  return { at: new Date(invoice.created * 1000), amountCents: invoice.amount_due };
};

type ResolvedPrice = Pick<Stripe.Price, "lookup_key" | "unit_amount">;

/** The change programmed by a subscription schedule for the end of the current phase, if one is. */
const readScheduledChange = (
  schedule: Stripe.Subscription["schedule"],
  current: StripePriceKey,
): ScheduledChange | null => {
  if (schedule === null || typeof schedule === "string") return null;
  if (schedule.status !== "active" && schedule.status !== "not_started") return null;
  const currentEnd = schedule.current_phase?.end_date;
  if (currentEnd === undefined) return null;
  const next = schedule.phases.find((phase) => phase.start_date === currentEnd);
  const price = next?.items[0]?.price;
  if (price === undefined || typeof price === "string" || ("deleted" in price && price.deleted)) return null;
  const resolved = price as ResolvedPrice;
  const key = readStripePriceKey(resolved);
  if (key === null) return null;
  if (key.plan === current.plan && key.period === current.period) return null;
  return { ...key, amountCents: resolved.unit_amount ?? 0, at: new Date(currentEnd * 1000) };
};

/**
 * What PULSACITY keeps of a Stripe subscription, retrieved with SUBSCRIPTION_EXPANSIONS. Null for a subscription to a
 * price PULSACITY does not sell (its lookup key is not one of plans.ts).
 */
export const readSubscriptionSnapshot = (subscription: Stripe.Subscription): SubscriptionSnapshot | null => {
  const item = subscription.items.data[0];
  const key = readStripePriceKey(item?.price);
  if (item === undefined || key === null) return null;
  const ended = isSubscriptionOver(subscription.status);
  const currentPeriodEnd = toDate(item.current_period_end);
  const cancelAt = ended
    ? null
    : (toDate(subscription.cancel_at) ?? (subscription.cancel_at_period_end ? currentPeriodEnd : null));
  const betaDiscount = readBetaDiscount(subscription.discounts);
  return {
    id: subscription.id,
    customerId: readId(subscription.customer) ?? "",
    spaceId: readSpaceId(subscription.metadata),
    status: subscription.status,
    ...key,
    amountCents: item.price.unit_amount ?? 0,
    currentPeriodEnd,
    cancelAt,
    endedAt: toDate(subscription.ended_at),
    scheduled: ended || cancelAt !== null ? null : readScheduledChange(subscription.schedule, key),
    betaTester: betaDiscount !== null,
    betaUntil: toDate(betaDiscount?.end),
    card: readCard(subscription.default_payment_method) ?? readCustomerCard(subscription.customer),
    lastPaymentFailed: readLastPaymentFailed(subscription.status, subscription.latest_invoice),
  };
};
