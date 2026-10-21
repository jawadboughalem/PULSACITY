import { and, eq } from "drizzle-orm";
import type { Database } from "@/db/database";
import { purchases, reviewRequests, spaces, testimonials } from "@/db/schema";

export type WithdrawConsentResult =
  /** The testimonial is deleted; its photo, if any, still has to leave the storage. */
  | { status: "withdrawn"; authorPhotoUrl: string | null }
  | { status: "not-found" };

/**
 * « Retirer mon accord » (2.7, consentement; CGU 7.2): the author of a review answered by the link of their request
 * withdraws the consent to its publication. The review goes for good, as the privacy policy keeps it « jusqu'au retrait
 * de votre accord »: with its corrections, the widgets stop showing it once their cache is renewed (24 hours at most).
 */
export const withdrawConsent = async (
  database: Database,
  spaceSlug: string,
  requestToken: string,
): Promise<WithdrawConsentResult> =>
  database.transaction(async (transaction): Promise<WithdrawConsentResult> => {
    const [review] = await transaction
      .select({ id: testimonials.id, spaceId: testimonials.spaceId, authorPhotoUrl: testimonials.authorPhotoUrl })
      .from(reviewRequests)
      .innerJoin(purchases, eq(purchases.id, reviewRequests.purchaseId))
      .innerJoin(spaces, eq(spaces.id, purchases.spaceId))
      .innerJoin(
        testimonials,
        and(eq(testimonials.reviewRequestId, reviewRequests.id), eq(testimonials.spaceId, purchases.spaceId)),
      )
      .where(
        and(
          eq(reviewRequests.token, requestToken),
          eq(reviewRequests.status, "completed"),
          eq(spaces.slug, spaceSlug),
        ),
      )
      .limit(1)
      .for("update", { of: testimonials });
    if (!review) return { status: "not-found" };

    await transaction
      .delete(testimonials)
      .where(and(eq(testimonials.id, review.id), eq(testimonials.spaceId, review.spaceId)));
    return { status: "withdrawn", authorPhotoUrl: review.authorPhotoUrl };
  });
