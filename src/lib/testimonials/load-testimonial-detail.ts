import { and, desc, eq } from "drizzle-orm";
import type { Database } from "@/db/database";
import { connections, products, purchases, reviewRequests, testimonials } from "@/db/schema";
import type { TestimonialStatus } from "./testimonial-filters";

export type TestimonialRequestOrigin = {
  connector: string | null;
  purchasedAt: Date;
  requestSentAt: Date | null;
  answeredAt: Date | null;
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
  request: TestimonialRequestOrigin | null;
};

export const loadTestimonialDetail = async (
  database: Database,
  spaceId: string,
  testimonialId: string,
): Promise<TestimonialDetail | null> => {
  const [testimonial] = await database
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
      customerId: testimonials.customerId,
    })
    .from(testimonials)
    .leftJoin(products, eq(products.id, testimonials.productId))
    .where(and(eq(testimonials.id, testimonialId), eq(testimonials.spaceId, spaceId)))
    .limit(1);
  if (!testimonial) return null;

  const { customerId, ...detail } = testimonial;
  if (!customerId || !detail.productId) return { ...detail, request: null };

  const [request] = await database
    .select({
      connector: connections.connector,
      purchasedAt: purchases.purchasedAt,
      requestSentAt: reviewRequests.sentAt,
      answeredAt: reviewRequests.completedAt,
    })
    .from(reviewRequests)
    .innerJoin(purchases, eq(purchases.id, reviewRequests.purchaseId))
    .leftJoin(connections, eq(connections.id, purchases.connectionId))
    .where(
      and(
        eq(purchases.spaceId, spaceId),
        eq(purchases.customerId, customerId),
        eq(purchases.productId, detail.productId),
        eq(reviewRequests.status, "completed"),
      ),
    )
    .orderBy(desc(reviewRequests.completedAt))
    .limit(1);
  return { ...detail, request: request ?? null };
};
