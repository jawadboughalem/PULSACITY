import { and, asc, avg, count, eq, lte, or, sql } from "drizzle-orm";
import type { Database } from "@/db/database";
import { testimonials } from "@/db/schema";
import type { WidgetTestimonialSource } from "./build-widget-payload";
import { SHOWN_TESTIMONIAL_COLUMNS, toWidgetTestimonialSource } from "./load-widget-payload";
import { MAX_WIDGET_MAX_ITEMS } from "./widget-settings";

export type PreviewTestimonial = WidgetTestimonialSource & { productId: string | null };

export type ShownSummary = { total: number; averageRating: number | null };

export type WidgetPreviewData = {
  testimonials: PreviewTestimonial[];
  summaries: { all: ShownSummary; byOffer: Record<string, ShownSummary> };
};

const toSummary = (row: { total: number; averageRating: string | null }): ShownSummary => ({
  total: row.total,
  averageRating: row.averageRating === null ? null : Number(row.averageRating),
});

/**
 * Everything the live preview of the editor needs, loaded once: the first validated testimonials of the space and of
 * each offer, as many as a widget can show, and the count and average of each. Changing a setting redraws in place.
 */
export const loadWidgetPreview = async (database: Database, spaceId: string): Promise<WidgetPreviewData> => {
  const approved = and(eq(testimonials.spaceId, spaceId), eq(testimonials.status, "approved"));
  const shownOrder = sql`${testimonials.featured} desc, ${testimonials.createdAt} desc, ${testimonials.id} desc`;
  const ranked = database.$with("ranked").as(
    database
      .select({
        ...SHOWN_TESTIMONIAL_COLUMNS,
        rankInSpace: sql<number>`row_number() over (order by ${shownOrder})`.as("rank_in_space"),
        rankInOffer: sql<number>`row_number() over (partition by ${testimonials.productId} order by ${shownOrder})`.as(
          "rank_in_offer",
        ),
      })
      .from(testimonials)
      .where(approved),
  );

  const [rows, [overall], perOffer] = await Promise.all([
    database
      .with(ranked)
      .select()
      .from(ranked)
      .where(or(lte(ranked.rankInSpace, MAX_WIDGET_MAX_ITEMS), lte(ranked.rankInOffer, MAX_WIDGET_MAX_ITEMS)))
      .orderBy(asc(ranked.rankInSpace)),
    database.select({ total: count(), averageRating: avg(testimonials.rating) }).from(testimonials).where(approved),
    database
      .select({ productId: testimonials.productId, total: count(), averageRating: avg(testimonials.rating) })
      .from(testimonials)
      .where(approved)
      .groupBy(testimonials.productId),
  ]);

  return {
    testimonials: rows.map((row) => ({ ...toWidgetTestimonialSource(row), productId: row.productId })),
    summaries: {
      all: toSummary(overall),
      byOffer: Object.fromEntries(
        perOffer.flatMap((row) => (row.productId ? [[row.productId, toSummary(row)] as const] : [])),
      ),
    },
  };
};
