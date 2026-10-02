import { type SQL, and, avg, count, desc, eq, isNull } from "drizzle-orm";
import type { Database } from "@/db/database";
import { spaces, testimonials, widgets } from "@/db/schema";
import { toParisIsoDay } from "@/lib/dates/paris-date";
import { getDisplayedBody } from "@/lib/testimonials/displayed-body";
import type { WidgetPayload } from "../../../widget/src/payload";
import {
  type WidgetTestimonialSource,
  buildPoweredByUrl,
  buildWidgetPayload,
  countTestimonialsForAnswer,
} from "./build-widget-payload";
import { resolveWidgetSettings } from "./widget-settings";

export type LoadedWidgetPayload = {
  payload: WidgetPayload;
  firstLoadedAt: Date | null;
};

type LoadOptions = {
  appUrl: string;
  /** For a wall, where « Voir les autres avis » starts. Ignored by the carousel and the badge. */
  offset: number;
};

/** The validated testimonials a widget shows: those of its offer, or of the whole space. */
export const shownTestimonialsFilter = (spaceId: string, productId: string | null): SQL | undefined =>
  and(
    eq(testimonials.spaceId, spaceId),
    eq(testimonials.status, "approved"),
    productId ? eq(testimonials.productId, productId) : undefined,
  );

export const SHOWN_TESTIMONIALS_ORDER = [desc(testimonials.featured), desc(testimonials.createdAt), desc(testimonials.id)];

export const SHOWN_TESTIMONIAL_COLUMNS = {
  productId: testimonials.productId,
  authorName: testimonials.authorName,
  authorTitle: testimonials.authorTitle,
  authorPhotoUrl: testimonials.authorPhotoUrl,
  rating: testimonials.rating,
  body: testimonials.body,
  displayBody: testimonials.displayBody,
  createdAt: testimonials.createdAt,
};

type ShownTestimonialRow = {
  authorName: string;
  authorTitle: string | null;
  authorPhotoUrl: string | null;
  rating: number;
  body: string;
  displayBody: string | null;
  createdAt: Date;
};

export const toWidgetTestimonialSource = (row: ShownTestimonialRow): WidgetTestimonialSource => ({
  authorName: row.authorName,
  authorTitle: row.authorTitle,
  authorPhotoUrl: row.authorPhotoUrl,
  rating: row.rating,
  text: getDisplayedBody(row),
  receivedOn: toParisIsoDay(row.createdAt),
});

export const loadWidgetPayload = async (
  database: Database,
  widgetId: string,
  { appUrl, offset }: LoadOptions,
): Promise<LoadedWidgetPayload | null> => {
  const [widget] = await database
    .select({
      type: widgets.type,
      productId: widgets.productId,
      settings: widgets.settings,
      firstLoadedAt: widgets.firstLoadedAt,
      spaceId: spaces.id,
      plan: spaces.plan,
      referralCode: spaces.referralCode,
      spaceAccentColor: spaces.accentColor,
    })
    .from(widgets)
    .innerJoin(spaces, eq(spaces.id, widgets.spaceId))
    .where(eq(widgets.id, widgetId))
    .limit(1);
  if (!widget) return null;

  const settings = resolveWidgetSettings(widget.settings);
  const start = widget.type === "wall" ? offset : 0;
  const shown = shownTestimonialsFilter(widget.spaceId, widget.productId);
  const [[summary], rows] = await Promise.all([
    database.select({ total: count(), averageRating: avg(testimonials.rating) }).from(testimonials).where(shown),
    database
      .select(SHOWN_TESTIMONIAL_COLUMNS)
      .from(testimonials)
      .where(shown)
      .orderBy(...SHOWN_TESTIMONIALS_ORDER)
      .limit(countTestimonialsForAnswer(widget.type, settings.maxItems, start))
      .offset(start),
  ]);

  return {
    firstLoadedAt: widget.firstLoadedAt,
    payload: buildWidgetPayload({
      type: widget.type,
      settings,
      spaceAccentColor: widget.spaceAccentColor,
      poweredBy: buildPoweredByUrl(appUrl, widget, settings),
      total: summary.total,
      averageRating: summary.averageRating === null ? null : Number(summary.averageRating),
      testimonials: rows.map(toWidgetTestimonialSource),
      offset: start,
    }),
  };
};

/** The first display of a widget on a page ticks the « Coller le widget » step of the space. */
export const markWidgetFirstLoaded = async (database: Database, widgetId: string): Promise<void> => {
  await database
    .update(widgets)
    .set({ firstLoadedAt: new Date() })
    .where(and(eq(widgets.id, widgetId), isNull(widgets.firstLoadedAt)));
};
