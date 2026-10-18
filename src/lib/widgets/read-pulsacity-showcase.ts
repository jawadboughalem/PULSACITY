import * as Sentry from "@sentry/nextjs";
import { and, asc, count, eq } from "drizzle-orm";
import { PULSACITY_SHOWCASE_MIN_TESTIMONIALS, readPulsacitySpaceId } from "@/config/pulsacity-space";
import { getDb } from "@/db";
import type { Database } from "@/db/database";
import { testimonials, widgets } from "@/db/schema";
import type { WidgetType } from "../../../widget/src/payload";
import { shownTestimonialsFilter } from "./load-widget-payload";

export type PulsacityShowcase = {
  /** The wall of the home page, the badge of Tarifs: null while the widget is missing or has too few testimonials. */
  wallWidgetId: string | null;
  badgeWidgetId: string | null;
};

const NO_SHOWCASE: PulsacityShowcase = { wallWidgetId: null, badgeWidgetId: null };

/** The space's oldest widget of a type, when it shows enough validated testimonials. */
const findShownWidget = async (database: Database, spaceId: string, type: WidgetType): Promise<string | null> => {
  const [widget] = await database
    .select({ id: widgets.id, productId: widgets.productId })
    .from(widgets)
    .where(and(eq(widgets.spaceId, spaceId), eq(widgets.type, type)))
    .orderBy(asc(widgets.createdAt), asc(widgets.id))
    .limit(1);
  if (widget === undefined) return null;
  const [shown] = await database
    .select({ value: count() })
    .from(testimonials)
    .where(shownTestimonialsFilter(spaceId, widget.productId));
  return (shown?.value ?? 0) >= PULSACITY_SHOWCASE_MIN_TESTIMONIALS ? widget.id : null;
};

/**
 * PULSACITY's own testimonials on pulsacity.com (lot 4.12): the wall and the badge of its space, only once there are
 * enough real ones, never an invented one. A build without its database (the CI) and an environment without the space
 * show nothing; a page rebuilt later reads them, and shows nothing if the database does not answer.
 */
export const readPulsacityShowcase = async (database?: Database): Promise<PulsacityShowcase> => {
  const spaceId = readPulsacitySpaceId();
  if (spaceId === null) return NO_SHOWCASE;
  if (database === undefined && process.env.NEXT_PHASE === "phase-production-build" && !process.env.DATABASE_URL) {
    return NO_SHOWCASE;
  }
  try {
    const source = database ?? getDb();
    const [wallWidgetId, badgeWidgetId] = await Promise.all([
      findShownWidget(source, spaceId, "wall"),
      findShownWidget(source, spaceId, "badge"),
    ]);
    return { wallWidgetId, badgeWidgetId };
  } catch (error) {
    Sentry.captureException(error);
    return NO_SHOWCASE;
  }
};
