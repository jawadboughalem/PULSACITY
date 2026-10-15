import { and, asc, eq, inArray } from "drizzle-orm";
import { type Limit, type PlanId, UNLIMITED, getPlan } from "@/config/plans";
import type { Database } from "@/db/database";
import { spaces, widgets } from "@/db/schema";

export type RankedWidget = { id: string; createdAt: Date; freePlanChosenAt: Date | null };

/**
 * Back on the free plan (decisions/tarifs.md), as many widgets as the plan allows stay on the pages: the one chosen
 * last with « Afficher celui-ci à la place », or else the oldest. The others are paused: their code stays on the page,
 * nothing shows, and they come back with Essentiel. Rien n'est supprimé.
 */
export const readDisplayedWidgetIds = (spaceWidgets: RankedWidget[], limit: Limit): Set<string> => {
  if (limit === UNLIMITED || spaceWidgets.length <= limit) return new Set(spaceWidgets.map((widget) => widget.id));
  const ranked = [...spaceWidgets].sort((left, right) => {
    const chosen = (right.freePlanChosenAt?.getTime() ?? 0) - (left.freePlanChosenAt?.getTime() ?? 0);
    if (chosen !== 0) return chosen;
    const created = left.createdAt.getTime() - right.createdAt.getTime();
    return created !== 0 ? created : left.id.localeCompare(right.id);
  });
  return new Set(ranked.slice(0, limit).map((widget) => widget.id));
};

export const listRankedWidgets = (database: Database, spaceId: string): Promise<RankedWidget[]> =>
  database
    .select({ id: widgets.id, createdAt: widgets.createdAt, freePlanChosenAt: widgets.freePlanChosenAt })
    .from(widgets)
    .where(eq(widgets.spaceId, spaceId))
    .orderBy(asc(widgets.createdAt), asc(widgets.id));

/** Whether a widget shows on its pages, given the plan of its space. */
export const isWidgetDisplayed = async (
  database: Database,
  { widgetId, spaceId, plan }: { widgetId: string; spaceId: string; plan: PlanId },
): Promise<boolean> => {
  const limit = getPlan(plan).limits.widgets;
  if (limit === UNLIMITED) return true;
  return readDisplayedWidgetIds(await listRankedWidgets(database, spaceId), limit).has(widgetId);
};

export type ChooseWidgetResult = { status: "chosen" } | { status: "not-found" };

/** « Afficher celui-ci à la place »: this widget shows, the one shown so far is paused. */
export const chooseDisplayedWidget = async (
  database: Database,
  userId: string,
  widgetId: string,
  now: Date = new Date(),
): Promise<ChooseWidgetResult> => {
  const owned = database
    .select({ id: widgets.id })
    .from(widgets)
    .innerJoin(spaces, eq(spaces.id, widgets.spaceId))
    .where(and(eq(widgets.id, widgetId), eq(spaces.userId, userId)));
  const chosen = await database
    .update(widgets)
    .set({ freePlanChosenAt: now })
    .where(inArray(widgets.id, owned))
    .returning({ id: widgets.id });
  return chosen.length === 1 ? { status: "chosen" } : { status: "not-found" };
};
