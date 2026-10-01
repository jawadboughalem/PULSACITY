import { and, eq } from "drizzle-orm";
import type { Database } from "@/db/database";
import { products, testimonials } from "@/db/schema";
import { findOwnedTestimonial } from "./find-owned-testimonial";
import type { TestimonialChangeResult } from "./set-testimonial-status";

export type TestimonialPresentation = {
  displayBody: string;
  authorName: string;
  authorTitle: string | null;
};

const normalize = (text: string) => text.replace(/\r\n?/g, "\n").trim();

/** The original body never changes: only what the widgets show does. */
export const editTestimonialPresentation = async (
  database: Database,
  userId: string,
  testimonialId: string,
  presentation: TestimonialPresentation,
  now = new Date(),
): Promise<TestimonialChangeResult> => {
  const testimonial = await findOwnedTestimonial(database, userId, testimonialId);
  if (!testimonial) return { status: "testimonial-not-found" };

  const displayBody = normalize(presentation.displayBody);
  const isOriginal = displayBody === normalize(testimonial.body);
  await database
    .update(testimonials)
    .set({
      authorName: presentation.authorName.trim(),
      authorTitle: presentation.authorTitle?.trim() || null,
      ...(isOriginal ? { displayBody: null, displayEditedAt: null } : { displayBody, displayEditedAt: now }),
    })
    .where(and(eq(testimonials.id, testimonial.id), eq(testimonials.spaceId, testimonial.spaceId)));
  return { status: "updated" };
};

export type SetTestimonialProductResult = TestimonialChangeResult | { status: "product-not-found" };

export const setTestimonialProduct = async (
  database: Database,
  userId: string,
  testimonialId: string,
  productId: string | null,
): Promise<SetTestimonialProductResult> => {
  const testimonial = await findOwnedTestimonial(database, userId, testimonialId);
  if (!testimonial) return { status: "testimonial-not-found" };
  if (productId) {
    const [product] = await database
      .select({ id: products.id })
      .from(products)
      .where(and(eq(products.id, productId), eq(products.spaceId, testimonial.spaceId)))
      .limit(1);
    if (!product) return { status: "product-not-found" };
  }

  await database
    .update(testimonials)
    .set({ productId })
    .where(and(eq(testimonials.id, testimonial.id), eq(testimonials.spaceId, testimonial.spaceId)));
  return { status: "updated" };
};
