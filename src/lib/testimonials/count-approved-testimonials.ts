import { and, count, eq } from "drizzle-orm";
import type { Database } from "@/db/database";
import { testimonials } from "@/db/schema";

/** The testimonial limit of a plan counts the validated ones: past it, new testimonials wait, nothing is removed. */
export const countApprovedTestimonials = async (database: Database, spaceId: string): Promise<number> => {
  const [{ approvedCount }] = await database
    .select({ approvedCount: count() })
    .from(testimonials)
    .where(and(eq(testimonials.spaceId, spaceId), eq(testimonials.status, "approved")));
  return approvedCount;
};
