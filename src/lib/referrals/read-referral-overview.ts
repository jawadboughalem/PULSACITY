import { desc, eq } from "drizzle-orm";
import { REFERRAL_REWARD_MONTHS } from "@/config/plans";
import type { Database } from "@/db/database";
import { referrals, spaces } from "@/db/schema";

/** « Vous voyez le nom de leur espace et leur statut, rien d'autre » (maquette 3.3). */
export type ReferralRow = {
  id: string;
  spaceName: string;
  signedUpAt: Date;
  /** Subscribed now: « Abonné »; otherwise « Inscrit ». */
  isSubscribed: boolean;
  /** When its first payment earned the month: « Offert le … ». */
  rewardedAt: Date | null;
};

export type ReferralOverview = {
  referrals: ReferralRow[];
  signedUp: number;
  subscribed: number;
  monthsOffered: number;
};

/** The referees of a space, newest first. A deleted referee leaves the list, the month it earned stays counted. */
export const readReferralOverview = async (database: Database, spaceId: string): Promise<ReferralOverview> => {
  const rows = await database
    .select({
      id: referrals.id,
      signedUpAt: referrals.createdAt,
      rewardedAt: referrals.rewardedAt,
      spaceName: spaces.name,
      subscriptionId: spaces.stripeSubscriptionId,
    })
    .from(referrals)
    .leftJoin(spaces, eq(spaces.id, referrals.refereeSpaceId))
    .where(eq(referrals.referrerSpaceId, spaceId))
    .orderBy(desc(referrals.createdAt), desc(referrals.id));
  const shown = rows.flatMap((row) =>
    row.spaceName === null
      ? []
      : [
          {
            id: row.id,
            spaceName: row.spaceName,
            signedUpAt: row.signedUpAt,
            isSubscribed: row.subscriptionId !== null,
            rewardedAt: row.rewardedAt,
          },
        ],
  );
  return {
    referrals: shown,
    signedUp: shown.length,
    subscribed: shown.filter((row) => row.isSubscribed).length,
    monthsOffered: rows.filter((row) => row.rewardedAt !== null).length * REFERRAL_REWARD_MONTHS,
  };
};
