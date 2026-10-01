import { and, eq } from "drizzle-orm";
import type { Database } from "@/db/database";
import { testimonials } from "@/db/schema";
import { findOwnedTestimonial } from "./find-owned-testimonial";

export type DeleteTestimonialResult =
  | { status: "deleted"; authorPhotoUrl: string | null }
  | { status: "testimonial-not-found" };

export const deleteTestimonial = async (
  database: Database,
  userId: string,
  testimonialId: string,
): Promise<DeleteTestimonialResult> => {
  const testimonial = await findOwnedTestimonial(database, userId, testimonialId);
  if (!testimonial) return { status: "testimonial-not-found" };

  await database
    .delete(testimonials)
    .where(and(eq(testimonials.id, testimonial.id), eq(testimonials.spaceId, testimonial.spaceId)));
  return { status: "deleted", authorPhotoUrl: testimonial.authorPhotoUrl };
};
