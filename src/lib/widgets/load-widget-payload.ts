import { type SQL, and, avg, count, desc, eq, isNull, lt, or } from "drizzle-orm";
import { UNLIMITED, getPlan } from "@/config/plans";
import { BETA_TESTER_MENTION, PULSACITY_BETA_OFFER_SLUG, readPulsacitySpaceId } from "@/config/pulsacity-space";
import type { Database } from "@/db/database";
import { products, spaces, testimonials, widgets } from "@/db/schema";
import { toParisIsoDay } from "@/lib/dates/paris-date";
import { getDisplayedBody } from "@/lib/testimonials/displayed-body";
import type { WidgetPayload } from "../../../widget/src/payload";
import {
  type WidgetTestimonialSource,
  buildPoweredByUrl,
  buildWidgetPayload,
  countTestimonialsForAnswer,
} from "./build-widget-payload";
import { isWidgetDisplayed } from "./free-plan-widgets";
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

/** On PULSACITY's own space, the beta testers' offer: its testimonials carry the counterpart under their author. */
const findBetaOfferId = async (database: Database, spaceId: string): Promise<string | null> => {
  if (spaceId !== readPulsacitySpaceId()) return null;
  const [offer] = await database
    .select({ id: products.id })
    .from(products)
    .where(and(eq(products.spaceId, spaceId), eq(products.slug, PULSACITY_BETA_OFFER_SLUG)))
    .limit(1);
  return offer?.id ?? null;
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
  // A widget paused by the free plan answers like an unknown one: nothing shows on the page.
  if (!(await isWidgetDisplayed(database, { widgetId, spaceId: widget.spaceId, plan: widget.plan }))) return null;

  const settings = resolveWidgetSettings(widget.settings);
  const start = widget.type === "wall" ? offset : 0;
  // Over the plan's testimonials (back on the free plan), the widget shows that many: featured first, then the newest.
  const shownLimit = getPlan(widget.plan).limits.testimonials;
  const answerSize = countTestimonialsForAnswer(widget.type, settings.maxItems, start);
  const rowLimit = shownLimit === UNLIMITED ? answerSize : Math.max(0, Math.min(answerSize, shownLimit - start));
  const shown = shownTestimonialsFilter(widget.spaceId, widget.productId);
  const [[summary], rows, betaOfferId] = await Promise.all([
    database.select({ total: count(), averageRating: avg(testimonials.rating) }).from(testimonials).where(shown),
    database
      .select(SHOWN_TESTIMONIAL_COLUMNS)
      .from(testimonials)
      .where(shown)
      .orderBy(...SHOWN_TESTIMONIALS_ORDER)
      .limit(rowLimit)
      .offset(start),
    findBetaOfferId(database, widget.spaceId),
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
      testimonials: rows.map((row) => ({
        ...toWidgetTestimonialSource(row),
        mention: betaOfferId !== null && row.productId === betaOfferId ? BETA_TESTER_MENTION : null,
      })),
      offset: start,
      shownLimit,
    }),
  };
};

/** A page showing a widget again writes it at most once an hour. */
const LAST_LOADED_PRECISION_MS = 60 * 60 * 1000;

/**
 * A page showed the widget: its first display ticks the « Coller le widget » step of the space, and the last one says
 * the widget is still live (the founder's dashboard: widgets shown in the last 7 days).
 */
export const markWidgetLoaded = async (database: Database, widgetId: string, now: Date = new Date()): Promise<void> => {
  await database
    .update(widgets)
    .set({ firstLoadedAt: now })
    .where(and(eq(widgets.id, widgetId), isNull(widgets.firstLoadedAt)));
  await database
    .update(widgets)
    .set({ lastLoadedAt: now })
    .where(
      and(
        eq(widgets.id, widgetId),
        or(isNull(widgets.lastLoadedAt), lt(widgets.lastLoadedAt, new Date(now.getTime() - LAST_LOADED_PRECISION_MS))),
      ),
    );
};
