import { and, eq, isNull, sql } from "drizzle-orm";
import { canAddTestimonial, getPlan } from "@/config/plans";
import type { Database } from "@/db/database";
import { spaces, testimonials } from "@/db/schema";
import { countApprovedTestimonials } from "./count-approved-testimonials";
import { findOwnedTestimonial } from "./find-owned-testimonial";

export type ReviewedTestimonialStatus = "approved" | "hidden";

export type TestimonialChangeResult = { status: "updated" } | { status: "testimonial-not-found" };

export type SetTestimonialStatusResult =
  | { status: "updated"; isFirstApproval: boolean }
  | { status: "testimonial-not-found" }
  | { status: "plan-limit-reached"; planName: string; testimonialLimit: number | null };

export const setTestimonialStatus = (
  database: Database,
  userId: string,
  testimonialId: string,
  status: ReviewedTestimonialStatus,
  now = new Date(),
): Promise<SetTestimonialStatusResult> =>
  database.transaction(async (transaction): Promise<SetTestimonialStatusResult> => {
    const testimonial = await findOwnedTestimonial(transaction, userId, testimonialId);
    if (!testimonial) return { status: "testimonial-not-found" };

    const isApproving = status === "approved" && testimonial.status !== "approved";
    if (isApproving) {
      await transaction.execute(
        sql`select pg_advisory_xact_lock(hashtext(${`add-testimonials:${testimonial.spaceId}`}))`,
      );
      if (!canAddTestimonial(testimonial, await countApprovedTestimonials(transaction, testimonial.spaceId))) {
        const plan = getPlan(testimonial.plan);
        return { status: "plan-limit-reached", planName: plan.name, testimonialLimit: plan.limits.testimonials };
      }
    }

    await transaction
      .update(testimonials)
      .set({ status })
      .where(and(eq(testimonials.id, testimonial.id), eq(testimonials.spaceId, testimonial.spaceId)));
    if (!isApproving || (await countApprovedTestimonials(transaction, testimonial.spaceId)) !== 1) {
      return { status: "updated", isFirstApproval: false };
    }

    const celebrated = await transaction
      .update(spaces)
      .set({ firstApprovalCelebratedAt: now })
      .where(and(eq(spaces.id, testimonial.spaceId), isNull(spaces.firstApprovalCelebratedAt)))
      .returning({ id: spaces.id });
    return { status: "updated", isFirstApproval: celebrated.length > 0 };
  });
