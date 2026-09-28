import { and, count, eq } from "drizzle-orm";
import { canAddTestimonial, getPlan } from "@/config/plans";
import type { Database } from "@/db/database";
import { products, purchases, reviewRequests, spaces, testimonials, user } from "@/db/schema";
import { getUploadPublicUrl } from "@/lib/uploads/presign-image-upload";
import { isTestimonialPhotoKeyOf } from "@/lib/uploads/upload-keys";
import { isReviewRequestActive } from "./active-review-request-statuses";
import { buildConsentText } from "./build-consent-text";
import { findCollectionProduct } from "./load-collection-page";

export type TestimonialSubmission = {
  spaceSlug: string;
  productSlug: string | null;
  requestToken: string | null;
  rating: number;
  body: string;
  authorName: string;
  authorTitle: string | null;
  photoKey: string | null;
};

export type NewTestimonialNotification = {
  creatorEmail: string;
  spaceName: string;
  productName: string | null;
  authorName: string;
  authorTitle: string | null;
  authorPhotoUrl: string | null;
  rating: number;
  body: string;
  planName: string;
  planTestimonialLimit: number | null;
  isOverPlanLimit: boolean;
};

export type SubmitTestimonialResult =
  | { status: "received"; notification: NewTestimonialNotification }
  | { status: "page-not-found" }
  | { status: "link-inactive" }
  | { status: "invalid-photo" };

export const submitTestimonial = async (
  database: Database,
  submission: TestimonialSubmission,
): Promise<SubmitTestimonialResult> => {
  const [space] = await database
    .select({ id: spaces.id, name: spaces.name, plan: spaces.plan, creatorEmail: user.email })
    .from(spaces)
    .innerJoin(user, eq(user.id, spaces.userId))
    .where(eq(spaces.slug, submission.spaceSlug))
    .limit(1);
  if (!space) return { status: "page-not-found" };

  const urlProduct = submission.productSlug
    ? await findCollectionProduct(database, space.id, submission.productSlug)
    : null;
  if (submission.productSlug && !urlProduct) return { status: "page-not-found" };
  if (submission.photoKey && !isTestimonialPhotoKeyOf(space.id, submission.photoKey)) {
    return { status: "invalid-photo" };
  }

  return database.transaction(async (transaction): Promise<SubmitTestimonialResult> => {
    let customerId: string | null = null;
    let product = urlProduct;

    if (submission.requestToken) {
      const [request] = await transaction
        .select({
          id: reviewRequests.id,
          status: reviewRequests.status,
          customerId: purchases.customerId,
          productId: products.id,
          productName: products.name,
          productSlug: products.slug,
        })
        .from(reviewRequests)
        .innerJoin(purchases, eq(purchases.id, reviewRequests.purchaseId))
        .innerJoin(products, eq(products.id, purchases.productId))
        .where(and(eq(reviewRequests.token, submission.requestToken), eq(purchases.spaceId, space.id)))
        .limit(1)
        .for("update", { of: reviewRequests });
      if (!request || !isReviewRequestActive(request.status)) return { status: "link-inactive" };

      await transaction
        .update(reviewRequests)
        .set({ status: "completed", completedAt: new Date() })
        .where(eq(reviewRequests.id, request.id));
      customerId = request.customerId;
      product = { id: request.productId, name: request.productName, slug: request.productSlug };
    }

    const [{ testimonialCount }] = await transaction
      .select({ testimonialCount: count() })
      .from(testimonials)
      .where(eq(testimonials.spaceId, space.id));
    const authorPhotoUrl = submission.photoKey ? getUploadPublicUrl(submission.photoKey) : null;

    await transaction.insert(testimonials).values({
      spaceId: space.id,
      productId: product?.id ?? null,
      customerId,
      authorName: submission.authorName,
      authorTitle: submission.authorTitle,
      authorPhotoUrl,
      rating: submission.rating,
      body: submission.body,
      status: "pending",
      source: "form",
      consentAt: new Date(),
      consentText: buildConsentText(space.name),
    });

    const plan = getPlan(space.plan);
    return {
      status: "received",
      notification: {
        creatorEmail: space.creatorEmail,
        spaceName: space.name,
        productName: product?.name ?? null,
        authorName: submission.authorName,
        authorTitle: submission.authorTitle,
        authorPhotoUrl,
        rating: submission.rating,
        body: submission.body,
        planName: plan.name,
        planTestimonialLimit: plan.limits.testimonials,
        isOverPlanLimit: !canAddTestimonial(space, testimonialCount),
      },
    };
  });
};
