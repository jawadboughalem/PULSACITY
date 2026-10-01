import { and, eq } from "drizzle-orm";
import type { Database } from "@/db/database";
import { testimonials } from "@/db/schema";
import { findOwnedTestimonial } from "./find-owned-testimonial";
import type { TestimonialChangeResult } from "./set-testimonial-status";

export const restoreTestimonialOriginal = async (
  database: Database,
  userId: string,
  testimonialId: string,
): Promise<TestimonialChangeResult> => {
  const testimonial = await findOwnedTestimonial(database, userId, testimonialId);
  if (!testimonial) return { status: "testimonial-not-found" };

  await database
    .update(testimonials)
    .set({ displayBody: null, displayEditedAt: null })
    .where(and(eq(testimonials.id, testimonial.id), eq(testimonials.spaceId, testimonial.spaceId)));
  return { status: "updated" };
};
