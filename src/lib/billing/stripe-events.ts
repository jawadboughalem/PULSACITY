import { and, asc, eq, gte, isNull, lt } from "drizzle-orm";
import type Stripe from "stripe";
import type { Database } from "@/db/database";
import { billingPayments, spaces, stripeEvents } from "@/db/schema";
import {
  type ApplySubscriptionResult,
  syncSubscription,
} from "./apply-subscription";
import { rewardReferrer } from "@/lib/referrals/reward-referrer";
import { BETA_REMINDER_DAYS, sendDueBetaReminders } from "./beta-reminders";

/** Keeps a verified event whole, before anything else: « duplicate » when Stripe sends it again. */
export const recordStripeEvent = async (
  database: Database,
  event: Stripe.Event,
): Promise<"new" | "duplicate"> => {
  const recorded = await database
    .insert(stripeEvents)
    .values({ id: event.id, type: event.type, payload: event })
    .onConflictDoNothing({ target: stripeEvents.id })
    .returning({ id: stripeEvents.id });
  return recorded.length === 1 ? "new" : "duplicate";
};

const readId = (
  value: string | { id: string } | null | undefined,
): string | null =>
  value === null || value === undefined
    ? null
    : typeof value === "string"
      ? value
      : value.id;

/**
 * Every invoice paid with money is kept for the threshold of the micro-entreprise (fin-v0/seuil-micro-entreprise.md).
 * Answers the space that paid, if known.
 */
const recordPayment = async (
  database: Database,
  invoice: Stripe.Invoice,
): Promise<string | null> => {
  if (invoice.amount_paid <= 0) return null;
  const subscriptionId = readId(
    invoice.parent?.subscription_details?.subscription,
  );
  const customerId = readId(invoice.customer);
  const metadataSpaceId =
    invoice.parent?.subscription_details?.metadata?.space_id ?? null;
  const [space] = await database
    .select({ id: spaces.id })
    .from(spaces)
    .where(
      metadataSpaceId !== null
        ? eq(spaces.id, metadataSpaceId)
        : eq(spaces.stripeCustomerId, customerId ?? ""),
    )
    .limit(1);
  await database
    .insert(billingPayments)
    .values({
      id: invoice.id,
      spaceId: space?.id ?? null,
      subscriptionId,
      amountCents: invoice.amount_paid,
      currency: invoice.currency,
      paidAt: new Date(
        (invoice.status_transitions.paid_at ?? invoice.created) * 1000,
      ),
    })
    .onConflictDoNothing({ target: billingPayments.id });
  return space?.id ?? null;
};

const findSubscriptionOfCustomer = async (
  database: Database,
  customerId: string | null,
): Promise<string | null> => {
  if (customerId === null) return null;
  const [space] = await database
    .select({ subscriptionId: spaces.stripeSubscriptionId })
    .from(spaces)
    .where(eq(spaces.stripeCustomerId, customerId))
    .limit(1);
  return space?.subscriptionId ?? null;
};

/** The subscription an event is about, to read again from Stripe; null for an event PULSACITY does not follow. */
export const findEventSubscription = async (
  database: Database,
  event: Stripe.Event,
): Promise<string | null> => {
  const object = event.data.object as unknown as Record<string, unknown> & {
    object?: string;
  };
  switch (object.object) {
    case "subscription":
      return (object as unknown as Stripe.Subscription).id;
    case "checkout.session": {
      const session = object as unknown as Stripe.Checkout.Session;
      return session.mode === "subscription"
        ? readId(session.subscription)
        : null;
    }
    case "invoice":
      return readId(
        (object as unknown as Stripe.Invoice).parent?.subscription_details
          ?.subscription,
      );
    case "subscription_schedule": {
      // Once released, a schedule no longer names its subscription in `subscription`, only in `released_subscription`.
      const schedule = object as unknown as Stripe.SubscriptionSchedule;
      return (
        readId(schedule.subscription) ?? readId(schedule.released_subscription)
      );
    }
    case "customer":
      return findSubscriptionOfCustomer(
        database,
        (object as unknown as Stripe.Customer).id,
      );
    case "payment_method":
      return findSubscriptionOfCustomer(
        database,
        readId((object as unknown as Stripe.PaymentMethod).customer),
      );
    default:
      return null;
  }
};

/**
 * Stripe announces the coming invoice: for a beta tester, the first one paid. The reminder is due 7 days before it,
 * counted on the invoice's own date, which a test clock moves forward in the recette.
 */
const remindBetaTester = async (
  database: Database,
  invoice: Stripe.Invoice,
  subscriptionId: string,
) => {
  if (invoice.amount_due <= 0) return;
  const paymentAt = (invoice.next_payment_attempt ?? invoice.period_end) * 1000;
  // One day of margin: the offered months may end a few seconds after the invoice is due.
  const remindAt = new Date(
    paymentAt - (BETA_REMINDER_DAYS - 1) * 24 * 60 * 60 * 1000,
  );
  await sendDueBetaReminders(database, { now: remindAt, subscriptionId });
};

export type StripeEventOutcome =
  | { status: "processed"; subscription: ApplySubscriptionResult | null }
  | { status: "already-processed" }
  | { status: "not-found" };

/**
 * Processes a recorded event: a paid invoice is kept, then the subscription is read again from Stripe and applied.
 * Everything here can run twice without effect, so a replay (the cron task) is always safe.
 */
export const processStripeEvent = async (
  database: Database,
  stripe: Stripe,
  eventId: string,
  now: Date = new Date(),
): Promise<StripeEventOutcome> => {
  const [recorded] = await database
    .select({
      payload: stripeEvents.payload,
      processedAt: stripeEvents.processedAt,
    })
    .from(stripeEvents)
    .where(eq(stripeEvents.id, eventId));
  if (recorded === undefined) return { status: "not-found" };
  if (recorded.processedAt !== null) return { status: "already-processed" };
  const event = recorded.payload as Stripe.Event;
  try {
    const payingSpaceId =
      event.type === "invoice.paid"
        ? await recordPayment(database, event.data.object)
        : null;
    const subscriptionId = await findEventSubscription(database, event);
    const subscription =
      subscriptionId === null
        ? null
        : await syncSubscription(database, stripe, subscriptionId, now);
    if (payingSpaceId !== null && event.type === "invoice.paid") {
      // A referee's first payment with money earns its referrer a month of Essentiel (lot 4.12).
      await rewardReferrer(database, stripe, {
        refereeSpaceId: payingSpaceId,
        invoiceId: event.data.object.id,
        now,
      });
    }
    if (event.type === "invoice.upcoming" && subscriptionId !== null) {
      await remindBetaTester(database, event.data.object, subscriptionId);
    }
    await database
      .update(stripeEvents)
      .set({ processedAt: now, error: null })
      .where(eq(stripeEvents.id, eventId));
    return { status: "processed", subscription };
  } catch (error) {
    await database
      .update(stripeEvents)
      .set({
        error: error instanceof Error ? error.message.slice(0, 500) : "unknown",
      })
      .where(eq(stripeEvents.id, eventId));
    throw error;
  }
};

const REPLAY_AFTER_MS = 2 * 60 * 1000;
const REPLAY_FOR_MS = 3 * 24 * 60 * 60 * 1000;

/** The events left unprocessed (a crash, Stripe unreachable): replayed by the cron task, for three days. */
export const listEventsToReplay = async (
  database: Database,
  now: Date = new Date(),
  limit = 20,
): Promise<string[]> => {
  const rows = await database
    .select({ id: stripeEvents.id })
    .from(stripeEvents)
    .where(
      and(
        isNull(stripeEvents.processedAt),
        lt(stripeEvents.receivedAt, new Date(now.getTime() - REPLAY_AFTER_MS)),
        gte(stripeEvents.receivedAt, new Date(now.getTime() - REPLAY_FOR_MS)),
      ),
    )
    .orderBy(asc(stripeEvents.receivedAt))
    .limit(limit);
  return rows.map((row) => row.id);
};
