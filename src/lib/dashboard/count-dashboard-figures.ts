import { and, count, eq, gte, sql } from "drizzle-orm";
import type { Database } from "@/db/database";
import { purchases, reviewRequests, testimonials } from "@/db/schema";
import { startOfParisMonth } from "@/lib/dates/paris-date";

export type DashboardFigures = {
  approved: number;
  pending: number;
  averageRating: number | null;
  requestsSentThisMonth: number;
};

export const countDashboardFigures = async (
  database: Database,
  spaceId: string,
  now = new Date(),
): Promise<DashboardFigures> => {
  const [[testimonialFigures], [requestFigures]] = await Promise.all([
    database
      .select({
        approved: sql<number>`count(*) filter (where ${testimonials.status} = 'approved')`.mapWith(Number),
        pending: sql<number>`count(*) filter (where ${testimonials.status} = 'pending')`.mapWith(Number),
        averageRating: sql<number | null>`avg(${testimonials.rating}) filter (where ${testimonials.status} = 'approved')`,
      })
      .from(testimonials)
      .where(eq(testimonials.spaceId, spaceId)),
    database
      .select({ sent: count() })
      .from(reviewRequests)
      .innerJoin(purchases, eq(purchases.id, reviewRequests.purchaseId))
      .where(and(eq(purchases.spaceId, spaceId), gte(reviewRequests.sentAt, startOfParisMonth(now)))),
  ]);
  const averageRating = testimonialFigures?.averageRating;
  return {
    approved: testimonialFigures?.approved ?? 0,
    pending: testimonialFigures?.pending ?? 0,
    averageRating: averageRating === null || averageRating === undefined ? null : Number(averageRating),
    requestsSentThisMonth: requestFigures?.sent ?? 0,
  };
};
