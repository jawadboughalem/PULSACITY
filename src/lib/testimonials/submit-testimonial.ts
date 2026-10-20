import { and, eq } from "drizzle-orm";
import { type PriceList, canAddTestimonial, getPlan } from "@/config/plans";
import type { Database } from "@/db/database";
import { connections, products, purchases, reviewRequests, spaces, testimonials, user } from "@/db/schema";
import { readCurrentPriceList } from "@/lib/billing/founder-seats";
import { getUploadPublicUrl } from "@/lib/uploads/presign-image-upload";
import { isTestimonialPhotoKeyOf } from "@/lib/uploads/upload-keys";
import { isReviewRequestActive } from "./active-review-request-statuses";
import { buildConsentText } from "./build-consent-text";
import { countApprovedTestimonials } from "./count-approved-testimonials";
import { findCollectionProduct } from "./load-collection-page";
import type { TestimonialProvenance } from "./testimonial-provenance";

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
  rating: number;
  body: string;
  /** « Vente reçue de Systeme.io · achat du 28 août 2026 » (maquettes 3.6, positionnement.md, point 1). */
  provenance: TestimonialProvenance;
  purchasedAt: Date | null;
  purchaseConnector: string | null;
  planName: string;
  planTestimonialLimit: number | null;
  isOverPlanLimit: boolean;
  /** The price of Essentiel the e-mail quotes when the free plan is full: the one the site shows. */
  priceList: PriceList;
};

export type SubmitTestimonialResult =
  /** notification is null when the creator turned off « Nouveau témoignage » (Réglages). */
  | { status: "received"; notification: NewTestimonialNotification | null }
  | { status: "page-not-found" }
  | { status: "link-inactive" }
  | { status: "invalid-photo" };

export const submitTestimonial = async (
  database: Database,
  submission: TestimonialSubmission,
): Promise<SubmitTestimonialResult> => {
  const [space] = await database
    .select({
      id: spaces.id,
      name: spaces.name,
      plan: spaces.plan,
      creatorEmail: user.email,
      notifiesCreator: spaces.newTestimonialEmailEnabled,
    })
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
    let origin: {
      provenance: TestimonialProvenance;
      reviewRequestId: string | null;
      purchasedAt: Date | null;
      purchaseConnector: string | null;
    } = { provenance: "public-link", reviewRequestId: null, purchasedAt: null, purchaseConnector: null };

    if (submission.requestToken) {
      const [request] = await transaction
        .select({
          id: reviewRequests.id,
          status: reviewRequests.status,
          customerId: purchases.customerId,
          productId: products.id,
          productName: products.name,
          productSlug: products.slug,
          purchaseSource: purchases.source,
          purchasedAt: purchases.purchasedAt,
          connector: connections.connector,
        })
        .from(reviewRequests)
        .innerJoin(purchases, eq(purchases.id, reviewRequests.purchaseId))
        .innerJoin(products, eq(products.id, purchases.productId))
        .leftJoin(connections, eq(connections.id, purchases.connectionId))
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
      origin = {
        provenance: request.purchaseSource === "connector" ? "sale" : "request",
        reviewRequestId: request.id,
        purchasedAt: request.purchasedAt,
        purchaseConnector: request.connector,
      };
    }

    const approvedCount = await countApprovedTestimonials(transaction, space.id);
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
      ...origin,
    });

    const plan = getPlan(space.plan);
    if (!space.notifiesCreator) return { status: "received", notification: null };
    const isOverPlanLimit = !canAddTestimonial(space, approvedCount);
    return {
      status: "received",
      notification: {
        creatorEmail: space.creatorEmail,
        spaceName: space.name,
        productName: product?.name ?? null,
        authorName: submission.authorName,
        authorTitle: submission.authorTitle,
        rating: submission.rating,
        body: submission.body,
        provenance: origin.provenance,
        purchasedAt: origin.purchasedAt,
        purchaseConnector: origin.purchaseConnector,
        planName: plan.name,
        planTestimonialLimit: plan.limits.testimonials,
        isOverPlanLimit,
        priceList: await readCurrentPriceList(transaction),
      },
    };
  });
};
