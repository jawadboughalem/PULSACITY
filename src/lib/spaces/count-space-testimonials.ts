import { count, eq, sql } from "drizzle-orm";
import type { Database } from "@/db/database";
import { testimonials } from "@/db/schema";

export type TestimonialCounts = {
  total: number;
  pending: number;
};

export const countSpaceTestimonials = async (database: Database, spaceId: string): Promise<TestimonialCounts> => {
  const [counts] = await database
    .select({
      total: count(),
      pending: sql<number>`count(*) filter (where ${testimonials.status} = 'pending')`.mapWith(Number),
    })
    .from(testimonials)
    .where(eq(testimonials.spaceId, spaceId));
  return { total: counts?.total ?? 0, pending: counts?.pending ?? 0 };
};
