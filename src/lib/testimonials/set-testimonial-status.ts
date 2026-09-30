import { and, eq } from "drizzle-orm";
import type { Database } from "@/db/database";
import { testimonials } from "@/db/schema";
import { findOwnedTestimonial } from "./find-owned-testimonial";

export type ReviewedTestimonialStatus = "approved" | "hidden";

export type TestimonialChangeResult = { status: "updated" } | { status: "testimonial-not-found" };

export const setTestimonialStatus = async (
  database: Database,
  userId: string,
  testimonialId: string,
  status: ReviewedTestimonialStatus,
): Promise<TestimonialChangeResult> => {
  const testimonial = await findOwnedTestimonial(database, userId, testimonialId);
  if (!testimonial) return { status: "testimonial-not-found" };

  await database
    .update(testimonials)
    .set({ status })
    .where(and(eq(testimonials.id, testimonial.id), eq(testimonials.spaceId, testimonial.spaceId)));
  return { status: "updated" };
};
