import { and, eq } from "drizzle-orm";
import type { Database } from "@/db/database";
import { testimonials } from "@/db/schema";
import { findOwnedTestimonial } from "./find-owned-testimonial";
import type { TestimonialChangeResult } from "./set-testimonial-status";

const normalize = (text: string) => text.replace(/\r\n?/g, "\n").trim();

export const editTestimonialDisplay = async (
  database: Database,
  userId: string,
  testimonialId: string,
  displayBody: string,
): Promise<TestimonialChangeResult> => {
  const testimonial = await findOwnedTestimonial(database, userId, testimonialId);
  if (!testimonial) return { status: "testimonial-not-found" };

  const isOriginal = normalize(displayBody) === normalize(testimonial.body);
  await database
    .update(testimonials)
    .set(
      isOriginal
        ? { displayBody: null, displayEditedAt: null }
        : { displayBody: normalize(displayBody), displayEditedAt: new Date() },
    )
    .where(and(eq(testimonials.id, testimonial.id), eq(testimonials.spaceId, testimonial.spaceId)));
  return { status: "updated" };
};

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
