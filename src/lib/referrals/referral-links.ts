import { eq } from "drizzle-orm";
import { MARKETING_PATHS } from "@/components/marketing/marketing-paths";
import type { Database } from "@/db/database";
import { spaces } from "@/db/schema";
import { withSignupSource } from "@/lib/acquisition/signup-source";

/**
 * « Propulsé par PULSACITY » (widget, page de collecte) leads to pulsacity.com with the space's referral code: a
 * creator who signs up from it is the space's referee. utm_source tells the badge from a referral link.
 */
export const buildBadgeReferralUrl = (appUrl: string, referralCode: string, medium: "widget" | "collecte"): string =>
  `${appUrl}${withSignupSource(MARKETING_PATHS.home, { utm_source: "badge", utm_medium: medium, ref: referralCode })}`;

/** Parrainage (maquette 3.3): pulsacity.com/p/<adresse de l'espace>, the address of its page de collecte. */
export const REFERRAL_LINK_PREFIX = "/p/";

export const buildReferralLink = (appUrl: string, spaceSlug: string): string =>
  `${appUrl}${REFERRAL_LINK_PREFIX}${spaceSlug}`;

/** Where a referral link leads: the home page with the space's referral code; the home page alone for an unknown one. */
export const resolveReferralLink = async (database: Database, spaceSlug: string): Promise<string> => {
  const [space] = await database
    .select({ referralCode: spaces.referralCode })
    .from(spaces)
    .where(eq(spaces.slug, spaceSlug.toLowerCase()))
    .limit(1);
  if (space === undefined) return MARKETING_PATHS.home;
  return withSignupSource(MARKETING_PATHS.home, {
    utm_source: "parrainage",
    utm_medium: "lien",
    ref: space.referralCode,
  });
};
