import { and, eq, ne, sql } from "drizzle-orm";
import type { Database } from "@/db/database";
import { referrals, spaceAcquisitions, spaces, widgets } from "@/db/schema";
import type { HeardFrom } from "@/lib/acquisition/heard-from";
import { type SignupSource, hasSignupSource } from "@/lib/acquisition/signup-source";
import { findOwnedSpace } from "./find-owned-space";
import { generateReferralCode } from "./generate-referral-code";
import { suggestAvailableSpaceSlug } from "./suggest-available-space-slug";

export type NewSpace = {
  name: string;
  slug: string;
  replyToEmail: string;
  accentColor: string | null;
  logoUrl: string | null;
};

/** Where the creator came from (lot 4.12): the source of the sign-up address, and the answer to the question. */
export type SpaceAcquisition = {
  source: SignupSource;
  heardFrom: HeardFrom | null;
};

const NO_ACQUISITION: SpaceAcquisition = { source: {}, heardFrom: null };

export type CreateSpaceResult =
  | { status: "created"; space: { id: string; slug: string } }
  | { status: "slug-taken"; suggestedSlug: string }
  | { status: "already-has-space" };

/** The source is kept when there is one; a known referral code, of another creator's space, makes it a referral. */
const recordAcquisition = async (
  transaction: Database,
  userId: string,
  spaceId: string,
  { source, heardFrom }: SpaceAcquisition,
) => {
  if (!hasSignupSource(source) && heardFrom === null) return;
  await transaction.insert(spaceAcquisitions).values({
    spaceId,
    heardFrom,
    utmSource: source.utm_source ?? null,
    utmMedium: source.utm_medium ?? null,
    utmCampaign: source.utm_campaign ?? null,
    utmContent: source.utm_content ?? null,
    utmTerm: source.utm_term ?? null,
    referralCode: source.ref ?? null,
  });
  if (source.ref === undefined) return;
  const [referrer] = await transaction
    .select({ id: spaces.id })
    .from(spaces)
    .where(and(eq(spaces.referralCode, source.ref), ne(spaces.userId, userId)))
    .limit(1);
  if (referrer !== undefined) {
    await transaction.insert(referrals).values({ referrerSpaceId: referrer.id, refereeSpaceId: spaceId });
  }
};

export const createSpace = (
  database: Database,
  userId: string,
  newSpace: NewSpace,
  acquisition: SpaceAcquisition = NO_ACQUISITION,
): Promise<CreateSpaceResult> =>
  database.transaction(async (transaction): Promise<CreateSpaceResult> => {
    await transaction.execute(sql`select pg_advisory_xact_lock(hashtext(${`create-space:${userId}`}))`);
    if (await findOwnedSpace(transaction, userId)) return { status: "already-has-space" };

    const [space] = await transaction
      .insert(spaces)
      .values({ ...newSpace, userId, referralCode: generateReferralCode() })
      .onConflictDoNothing({ target: spaces.slug })
      .returning({ id: spaces.id, slug: spaces.slug });
    if (!space) {
      return { status: "slug-taken", suggestedSlug: await suggestAvailableSpaceSlug(transaction, newSpace.slug) };
    }

    await transaction.insert(widgets).values({ spaceId: space.id, type: "wall" });
    await recordAcquisition(transaction, userId, space.id, acquisition);
    return { status: "created", space };
  });
