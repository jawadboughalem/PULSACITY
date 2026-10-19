/**
 * What a paying referee earned its referrer (decisions/commercialisation.md, P1 n° 6: a month of Essentiel, by a credit
 * or a coupon, never money):
 * - « credit »: subscribed, a month of Essentiel taken off the next payments (Stripe customer balance);
 * - « free-month »: on the free plan, Essentiel for a month;
 * - « offered »: the plan is already offered by PULSACITY, nothing more to give.
 */
export const REFERRAL_REWARDS = ["credit", "free-month", "offered"] as const;

export type ReferralReward = (typeof REFERRAL_REWARDS)[number];
