import type Stripe from "stripe";
import { type StripePriceKey, readStripeLookupKey, readStripePriceAmount } from "@/config/plans";
import { BETA_COUPON_ID } from "./read-subscription-snapshot";

/**
 * Stripe objects for the tests, in the shape of the API 2026-09-30.endive (only the fields PULSACITY reads). The real
 * events captured on the preview (docs-internes/connectors/stripe-billing.md) are checked against the same code.
 */

const seconds = (date: Date): number => Math.floor(date.getTime() / 1000);

export const buildStripePrice = (key: StripePriceKey, overrides: Partial<Stripe.Price> = {}): Stripe.Price =>
  ({
    id: `price_${readStripeLookupKey(key)}`,
    object: "price",
    active: true,
    currency: "eur",
    unit_amount: readStripePriceAmount(key),
    lookup_key: readStripeLookupKey(key),
    recurring: { interval: key.period === "monthly" ? "month" : "year", interval_count: 1 },
    tax_behavior: "unspecified",
    product: `prod_${key.plan}`,
    ...overrides,
  }) as Stripe.Price;

export type SubscriptionFixture = {
  id?: string;
  customer?: string;
  spaceId?: string | null;
  status?: Stripe.Subscription.Status;
  key?: StripePriceKey;
  periodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
  endedAt?: Date | null;
  betaUntil?: Date | null;
  schedule?: Stripe.SubscriptionSchedule | null;
  card?: { brand: string; last4: string } | null;
  latestInvoice?: Partial<Stripe.Invoice> | null;
};

export const FOUNDER_ESSENTIEL_MONTHLY: StripePriceKey = { plan: "essentiel", period: "monthly", priceList: "founder" };

export const buildSubscription = ({
  id = "sub_test",
  customer = "cus_test",
  spaceId = null,
  status = "active",
  key = FOUNDER_ESSENTIEL_MONTHLY,
  periodEnd = new Date("2026-11-12T10:00:00Z"),
  cancelAtPeriodEnd = false,
  endedAt = null,
  betaUntil = null,
  schedule = null,
  card = { brand: "visa", last4: "4242" },
  latestInvoice = null,
}: SubscriptionFixture = {}): Stripe.Subscription =>
  ({
    id,
    object: "subscription",
    customer,
    status,
    metadata: spaceId === null ? {} : { space_id: spaceId },
    cancel_at: cancelAtPeriodEnd ? seconds(periodEnd) : null,
    cancel_at_period_end: cancelAtPeriodEnd,
    ended_at: endedAt === null ? null : seconds(endedAt),
    discounts:
      betaUntil === null
        ? []
        : [
            {
              id: "di_beta",
              object: "discount",
              end: seconds(betaUntil),
              start: seconds(new Date(betaUntil.getTime() - 92 * 24 * 60 * 60 * 1000)),
              source: { type: "coupon", coupon: { id: BETA_COUPON_ID, object: "coupon" } },
            },
          ],
    items: {
      object: "list",
      data: [
        {
          id: `si_${id}`,
          object: "subscription_item",
          current_period_end: seconds(periodEnd),
          price: buildStripePrice(key),
          quantity: 1,
        },
      ],
    },
    schedule,
    default_payment_method:
      card === null ? null : { id: "pm_test", object: "payment_method", card: { brand: card.brand, last4: card.last4 } },
    latest_invoice: latestInvoice === null ? null : { id: "in_latest", object: "invoice", ...latestInvoice },
    pending_update: null,
  }) as unknown as Stripe.Subscription;

/** A schedule from a subscription: the current phase until `at`, then the next price. */
export const buildSchedule = ({
  current,
  next,
  at,
  start = new Date(at.getTime() - 30 * 24 * 60 * 60 * 1000),
}: {
  current: StripePriceKey;
  next: StripePriceKey;
  at: Date;
  start?: Date;
}): Stripe.SubscriptionSchedule =>
  ({
    id: "sub_sched_test",
    object: "subscription_schedule",
    status: "active",
    subscription: "sub_test",
    current_phase: { start_date: seconds(start), end_date: seconds(at) },
    phases: [
      {
        start_date: seconds(start),
        end_date: seconds(at),
        items: [{ price: buildStripePrice(current), quantity: 1 }],
        discounts: [],
      },
      {
        start_date: seconds(at),
        end_date: seconds(new Date(at.getTime() + 30 * 24 * 60 * 60 * 1000)),
        items: [{ price: buildStripePrice(next), quantity: 1 }],
        discounts: [],
      },
    ],
  }) as unknown as Stripe.SubscriptionSchedule;

export const buildInvoice = ({
  id = "in_test",
  subscription = "sub_test",
  customer = "cus_test",
  spaceId = null,
  amountPaid = 999,
  amountDue = 999,
  paidAt = new Date("2026-10-12T10:00:00Z"),
  status = "paid",
}: {
  id?: string;
  subscription?: string;
  customer?: string;
  spaceId?: string | null;
  amountPaid?: number;
  amountDue?: number;
  paidAt?: Date;
  status?: Stripe.Invoice.Status;
} = {}): Stripe.Invoice =>
  ({
    id,
    object: "invoice",
    customer,
    currency: "eur",
    amount_paid: amountPaid,
    amount_due: amountDue,
    status,
    attempt_count: 1,
    created: seconds(paidAt),
    period_end: seconds(paidAt),
    next_payment_attempt: null,
    status_transitions: { paid_at: status === "paid" ? seconds(paidAt) : null },
    parent: {
      type: "subscription_details",
      quote_details: null,
      subscription_details: { subscription, metadata: spaceId === null ? {} : { space_id: spaceId } },
    },
  }) as unknown as Stripe.Invoice;

export const buildEvent = <T extends Stripe.Event["type"]>(
  type: T,
  object: unknown,
  id = `evt_${type.replace(/\./g, "_")}`,
): Stripe.Event =>
  ({
    id,
    object: "event",
    type,
    api_version: "2026-09-30.endive",
    created: seconds(new Date("2026-10-12T10:00:00Z")),
    livemode: false,
    data: { object },
  }) as unknown as Stripe.Event;
