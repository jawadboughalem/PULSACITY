import { and, count, desc, eq } from "drizzle-orm";
import type { Database } from "@/db/database";
import { customers, products, reviewRequests, testimonialCorrections, testimonials } from "@/db/schema";
import type { CorrectionOutcome } from "./corrections/correction-outcome";
import type { HiddenReason } from "./hidden-reasons";
import { type AuthorReach, readAuthorReach } from "./load-author-contact";
import type { TestimonialStatus } from "./testimonial-filters";
import { type TestimonialProvenance, readTestimonialProvenance } from "./testimonial-provenance";

/** The request the testimonial answered, while it exists: when it left, when the author answered. */
export type TestimonialRequestOrigin = {
  requestSentAt: Date | null;
  answeredAt: Date | null;
};

/** The last correction proposed to the author, whatever became of it. */
export type TestimonialCorrection = {
  fromBody: string;
  body: string;
  createdAt: Date;
  answeredAt: Date | null;
  /** Null while it waits for the author. */
  outcome: CorrectionOutcome | null;
};

export type TestimonialDetail = {
  id: string;
  authorName: string;
  authorTitle: string | null;
  authorPhotoUrl: string | null;
  rating: number;
  body: string;
  displayBody: string | null;
  displayEditedAt: Date | null;
  status: TestimonialStatus;
  source: "form" | "manual" | "csv";
  featured: boolean;
  consentAt: Date | null;
  consentText: string | null;
  createdAt: Date;
  productId: string | null;
  productName: string | null;
  provenance: TestimonialProvenance;
  /** The purchase PULSACITY knows (sale received, or typed in « Demander un avis »). */
  purchasedAt: Date | null;
  purchaseConnector: string | null;
  request: TestimonialRequestOrigin | null;
  hiddenAt: Date | null;
  hiddenReason: HiddenReason | null;
  hiddenReasonDetail: string | null;
  hiddenReasonSentAt: Date | null;
  /** Can an e-mail reach the author: the reason of « Masquer », a correction. */
  authorReach: AuthorReach;
  correction: TestimonialCorrection | null;
  correctionsProposed: number;
};

export const loadTestimonialDetail = async (
  database: Database,
  spaceId: string,
  testimonialId: string,
): Promise<TestimonialDetail | null> => {
  const [row] = await database
    .select({
      id: testimonials.id,
      authorName: testimonials.authorName,
      authorTitle: testimonials.authorTitle,
      authorPhotoUrl: testimonials.authorPhotoUrl,
      rating: testimonials.rating,
      body: testimonials.body,
      displayBody: testimonials.displayBody,
      displayEditedAt: testimonials.displayEditedAt,
      status: testimonials.status,
      source: testimonials.source,
      featured: testimonials.featured,
      consentAt: testimonials.consentAt,
      consentText: testimonials.consentText,
      createdAt: testimonials.createdAt,
      productId: testimonials.productId,
      productName: products.name,
      provenance: testimonials.provenance,
      purchasedAt: testimonials.purchasedAt,
      purchaseConnector: testimonials.purchaseConnector,
      requestSentAt: reviewRequests.sentAt,
      answeredAt: reviewRequests.completedAt,
      hasRequest: reviewRequests.id,
      hiddenAt: testimonials.hiddenAt,
      hiddenReason: testimonials.hiddenReason,
      hiddenReasonDetail: testimonials.hiddenReasonDetail,
      hiddenReasonSentAt: testimonials.hiddenReasonSentAt,
      email: customers.email,
      unsubscribedAt: customers.unsubscribedAt,
    })
    .from(testimonials)
    .leftJoin(products, eq(products.id, testimonials.productId))
    .leftJoin(reviewRequests, eq(reviewRequests.id, testimonials.reviewRequestId))
    .leftJoin(customers, eq(customers.id, testimonials.customerId))
    .where(and(eq(testimonials.id, testimonialId), eq(testimonials.spaceId, spaceId)))
    .limit(1);
  if (!row) return null;

  const [[correction], [{ proposed }]] = await Promise.all([
    database
      .select({
        fromBody: testimonialCorrections.fromBody,
        body: testimonialCorrections.body,
        createdAt: testimonialCorrections.createdAt,
        answeredAt: testimonialCorrections.answeredAt,
        outcome: testimonialCorrections.outcome,
      })
      .from(testimonialCorrections)
      .where(eq(testimonialCorrections.testimonialId, row.id))
      .orderBy(desc(testimonialCorrections.createdAt))
      .limit(1),
    database
      .select({ proposed: count() })
      .from(testimonialCorrections)
      .where(eq(testimonialCorrections.testimonialId, row.id)),
  ]);

  const { requestSentAt, answeredAt, hasRequest, email, unsubscribedAt, ...detail } = row;
  return {
    ...detail,
    provenance: readTestimonialProvenance(row),
    request: hasRequest ? { requestSentAt, answeredAt } : null,
    authorReach: readAuthorReach({ email, unsubscribedAt }),
    correction: correction ?? null,
    correctionsProposed: proposed,
  };
};
