import { and, eq, isNotNull, isNull, lte, sql } from "drizzle-orm";
import type Stripe from "stripe";
import { REFERRAL_REWARD_MONTHS, readStripePriceAmount } from "@/config/plans";
import type { Database } from "@/db/database";
import { referrals, spaces, subscriptions } from "@/db/schema";
import type { ReferralReward } from "./referral-reward";

const addMonths = (date: Date, months: number): Date => {
  const next = new Date(date);
  next.setUTCMonth(next.getUTCMonth() + months);
  return next;
};

/** On the referrer's invoices and on Stripe's page: what the credit is. */
export const REFERRAL_CREDIT_DESCRIPTION = "Parrainage : un mois d'Essentiel offert";

export type RewardReferrerOutcome =
  | { status: "rewarded"; referrerSpaceId: string; reward: ReferralReward }
  | { status: "nothing-to-reward" };

type RewardOptions = { refereeSpaceId: string; invoiceId: string; now?: Date };

const giveReward = async (
  database: Database,
  stripe: Pick<Stripe, "customers">,
  referral: { id: string; referrerSpaceId: string },
  now: Date,
): Promise<ReferralReward> => {
  const [referrer] = await database
    .select({
      plan: spaces.plan,
      stripeSubscriptionId: spaces.stripeSubscriptionId,
      stripeCustomerId: spaces.stripeCustomerId,
      referralEssentielUntil: spaces.referralEssentielUntil,
      priceList: subscriptions.priceList,
    })
    .from(spaces)
    .leftJoin(subscriptions, eq(subscriptions.id, spaces.stripeSubscriptionId))
    .where(eq(spaces.id, referral.referrerSpaceId))
    .limit(1);
  if (referrer === undefined) return "offered";

  if (referrer.stripeSubscriptionId !== null && referrer.stripeCustomerId !== null) {
    // Subscribed: a month of Essentiel, at the referrer's own price, is taken off the next payments.
    const monthOfEssentiel = readStripePriceAmount({
      plan: "essentiel",
      period: "monthly",
      priceList: referrer.priceList ?? "founder",
    });
    await stripe.customers.createBalanceTransaction(
      referrer.stripeCustomerId,
      {
        amount: -monthOfEssentiel * REFERRAL_REWARD_MONTHS,
        currency: "eur",
        description: REFERRAL_CREDIT_DESCRIPTION,
        metadata: { referral_id: referral.id },
      },
      { idempotencyKey: `referral-reward-${referral.id}` },
    );
    return "credit";
  }

  if (referrer.plan === "free" || referrer.referralEssentielUntil !== null) {
    // On the free plan: Essentiel for a month, after the months already offered.
    const from =
      referrer.referralEssentielUntil !== null && referrer.referralEssentielUntil > now ? referrer.referralEssentielUntil : now;
    await database
      .update(spaces)
      .set({ plan: "essentiel", referralEssentielUntil: addMonths(from, REFERRAL_REWARD_MONTHS) })
      .where(eq(spaces.id, referral.referrerSpaceId));
    return "free-month";
  }

  // A paid plan offered by PULSACITY, without a subscription: nothing more to give.
  return "offered";
};

/**
 * The referee's first payment with money (invoice.paid): its referrer earns a month of Essentiel, once. The referral is
 * claimed before anything is given; if Stripe does not answer, the claim is released and the event's replay tries
 * again, with the same idempotency key, so the credit is never given twice.
 */
export const rewardReferrer = async (
  database: Database,
  stripe: Pick<Stripe, "customers">,
  { refereeSpaceId, invoiceId, now = new Date() }: RewardOptions,
): Promise<RewardReferrerOutcome> => {
  const [claimed] = await database
    .update(referrals)
    .set({ rewardedAt: now, rewardInvoiceId: invoiceId })
    .where(and(eq(referrals.refereeSpaceId, refereeSpaceId), isNull(referrals.rewardedAt)))
    .returning({ id: referrals.id, referrerSpaceId: referrals.referrerSpaceId });
  if (claimed === undefined) return { status: "nothing-to-reward" };
  try {
    const reward = await giveReward(database, stripe, claimed, now);
    await database.update(referrals).set({ reward }).where(eq(referrals.id, claimed.id));
    return { status: "rewarded", referrerSpaceId: claimed.referrerSpaceId, reward };
  } catch (error) {
    await database
      .update(referrals)
      .set({ rewardedAt: null, rewardInvoiceId: null })
      .where(eq(referrals.id, claimed.id));
    throw error;
  }
};

/**
 * The months of Essentiel offered on the free plan run out (cron task): the space goes back to the free plan, nothing
 * deleted; its widgets past the first pause, as at the end of a subscription. A space that subscribed meanwhile keeps
 * the plan of its subscription.
 */
export const endReferralMonths = async (database: Database, now: Date = new Date()): Promise<number> => {
  const ended = await database
    .update(spaces)
    .set({ plan: "free", freeSince: sql`${spaces.referralEssentielUntil}`, referralEssentielUntil: null })
    .where(
      and(
        lte(spaces.referralEssentielUntil, now),
        isNull(spaces.stripeSubscriptionId),
        eq(spaces.plan, "essentiel"),
      ),
    )
    .returning({ id: spaces.id });
  await database
    .update(spaces)
    .set({ referralEssentielUntil: null })
    .where(and(isNotNull(spaces.referralEssentielUntil), lte(spaces.referralEssentielUntil, now)));
  return ended.length;
};
