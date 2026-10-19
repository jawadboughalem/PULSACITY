import { and, eq } from "drizzle-orm";
import type { Database } from "@/db/database";
import { testimonials } from "@/db/schema";
import { findOwnedTestimonial } from "./find-owned-testimonial";
import type { HiddenReason } from "./hidden-reasons";
import type { TestimonialChangeResult } from "./set-testimonial-status";

export type HidingReason = {
  reason: HiddenReason;
  /** The words of « Autre motif »; ignored for any other reason. */
  detail: string | null;
};

/**
 * « Masquer » (positionnement.md, point 6): the testimonial leaves the widgets with its reason, kept with it and sent
 * to its author (sendHiddenReason). Hidden for a declared reason, it leaves the rating of the badge too (point 5).
 */
export const hideTestimonial = async (
  database: Database,
  userId: string,
  testimonialId: string,
  { reason, detail }: HidingReason,
  now = new Date(),
): Promise<TestimonialChangeResult> => {
  const testimonial = await findOwnedTestimonial(database, userId, testimonialId);
  if (!testimonial) return { status: "testimonial-not-found" };

  await database
    .update(testimonials)
    .set({
      status: "hidden",
      hiddenAt: now,
      hiddenReason: reason,
      hiddenReasonDetail: reason === "other" ? detail?.trim() || null : null,
    })
    .where(and(eq(testimonials.id, testimonial.id), eq(testimonials.spaceId, testimonial.spaceId)));
  return { status: "updated" };
};
