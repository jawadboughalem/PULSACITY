import { eq, sql } from "drizzle-orm";
import type Stripe from "stripe";
import type { PlanId } from "@/config/plans";
import type { Database } from "@/db/database";
import { spaces, subscriptions } from "@/db/schema";
import { takeFounderSeat } from "./founder-seats";
import {
  SUBSCRIPTION_EXPANSIONS,
  type SubscriptionSnapshot,
  isSubscriptionOver,
  keepsPlan,
  readEffectivePlan,
  readSubscriptionSnapshot,
} from "./read-subscription-snapshot";

export type ApplySubscriptionResult =
  | { status: "applied"; spaceId: string; plan: PlanId; previousPlan: PlanId; closedFounderPrice: boolean }
  | { status: "kept-apart"; spaceId: string }
  | { status: "no-space" }
  | { status: "not-pulsacity" };

type SpaceRow = { id: string; plan: PlanId; stripeSubscriptionId: string | null; stripeCustomerId: string | null };

const findSpace = async (database: Database, snapshot: SubscriptionSnapshot): Promise<SpaceRow | null> => {
  const columns = {
    id: spaces.id,
    plan: spaces.plan,
    stripeSubscriptionId: spaces.stripeSubscriptionId,
    stripeCustomerId: spaces.stripeCustomerId,
  };
  if (snapshot.spaceId !== null) {
    const [space] = await database.select(columns).from(spaces).where(eq(spaces.id, snapshot.spaceId)).for("update");
    if (space !== undefined) return space;
  }
  if (snapshot.customerId === "") return null;
  const [space] = await database
    .select(columns)
    .from(spaces)
    .where(eq(spaces.stripeCustomerId, snapshot.customerId))
    .for("update");
  return space ?? null;
};

const toRow = (snapshot: SubscriptionSnapshot, spaceId: string, now: Date) => ({
  id: snapshot.id,
  spaceId,
  status: snapshot.status,
  plan: snapshot.plan,
  period: snapshot.period,
  priceList: snapshot.priceList,
  amountCents: snapshot.amountCents,
  currentPeriodEnd: snapshot.currentPeriodEnd,
  cancelAt: snapshot.cancelAt,
  endedAt: snapshot.endedAt,
  scheduledPlan: snapshot.scheduled?.plan ?? null,
  scheduledPeriod: snapshot.scheduled?.period ?? null,
  scheduledPriceList: snapshot.scheduled?.priceList ?? null,
  scheduledAmountCents: snapshot.scheduled?.amountCents ?? null,
  scheduledAt: snapshot.scheduled?.at ?? null,
  cardBrand: snapshot.card?.brand ?? null,
  cardLast4: snapshot.card?.last4 ?? null,
  lastPaymentFailedAt: snapshot.lastPaymentFailed?.at ?? null,
  lastPaymentFailedAmountCents: snapshot.lastPaymentFailed?.amountCents ?? null,
  syncedAt: now,
});

/**
 * Writes what Stripe says of a subscription, and the plan of its space. Stripe stays the source: every event leads
 * here with a fresh copy, so events arriving late or twice change nothing. A space follows only its current
 * subscription; an older one, over, is kept apart.
 */
export const applySubscription = async (
  database: Database,
  subscription: Stripe.Subscription,
  now: Date = new Date(),
): Promise<ApplySubscriptionResult> => {
  const snapshot = readSubscriptionSnapshot(subscription);
  if (snapshot === null) return { status: "not-pulsacity" };
  return database.transaction(async (transaction) => {
    const space = await findSpace(transaction, snapshot);
    if (space === null) return { status: "no-space" };
    const row = toRow(snapshot, space.id, now);
    const [saved] = await transaction
      .insert(subscriptions)
      .values({ ...row, betaTester: snapshot.betaTester, betaUntil: snapshot.betaUntil })
      .onConflictDoUpdate({
        target: subscriptions.id,
        set: {
          ...row,
          // Once a beta tester, always: the offered months end, the founder price stays.
          betaTester: sql`${subscriptions.betaTester} or ${snapshot.betaTester}`,
          betaUntil: sql`coalesce(${snapshot.betaUntil?.toISOString() ?? null}::timestamptz, ${subscriptions.betaUntil})`,
        },
      })
      .returning({ betaTester: subscriptions.betaTester });
    const over = isSubscriptionOver(snapshot.status);
    const isCurrent = space.stripeSubscriptionId === snapshot.id || (space.stripeSubscriptionId === null && !over);
    if (!isCurrent) return { status: "kept-apart", spaceId: space.id };
    const plan = readEffectivePlan(snapshot);
    const wentBackToFree = plan === "free" && space.plan !== "free";
    await transaction
      .update(spaces)
      .set({
        plan,
        stripeSubscriptionId: over ? null : snapshot.id,
        stripeCustomerId: space.stripeCustomerId ?? (snapshot.customerId || null),
        ...(wentBackToFree ? { freeSince: snapshot.endedAt ?? now } : {}),
        ...(keepsPlan(snapshot.status) ? { freeSince: null } : {}),
      })
      .where(eq(spaces.id, space.id));
    const takesSeat = snapshot.priceList === "founder" && keepsPlan(snapshot.status) && saved?.betaTester === false;
    const closedFounderPrice = takesSeat ? await takeFounderSeat(transaction, space.id) : false;
    return { status: "applied", spaceId: space.id, plan, previousPlan: space.plan, closedFounderPrice };
  });
};

/** Reads the subscription from Stripe, whole, then applies it. */
export const syncSubscription = async (
  database: Database,
  stripe: Stripe,
  subscriptionId: string,
  now: Date = new Date(),
): Promise<ApplySubscriptionResult> => {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId, { expand: SUBSCRIPTION_EXPANSIONS });
  return applySubscription(database, subscription, now);
};
