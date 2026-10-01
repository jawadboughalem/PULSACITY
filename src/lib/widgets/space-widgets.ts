import { and, asc, count, eq, sql } from "drizzle-orm";
import { canCreateWidget, canHideBadge } from "@/config/plans";
import type { Database } from "@/db/database";
import { type WidgetSettings, products, spaces, widgets } from "@/db/schema";
import type { WidgetType } from "../../../widget/src/payload";
import type { WidgetEdit } from "./widget-settings";

export type SpaceWidget = {
  id: string;
  type: WidgetType;
  productId: string | null;
  productName: string | null;
  firstLoadedAt: Date | null;
};

export const listSpaceWidgets = (database: Database, spaceId: string): Promise<SpaceWidget[]> =>
  database
    .select({
      id: widgets.id,
      type: widgets.type,
      productId: widgets.productId,
      productName: products.name,
      firstLoadedAt: widgets.firstLoadedAt,
    })
    .from(widgets)
    .leftJoin(products, eq(products.id, widgets.productId))
    .where(eq(widgets.spaceId, spaceId))
    .orderBy(asc(widgets.createdAt), asc(widgets.id));

export type OwnedWidget = {
  id: string;
  type: WidgetType;
  productId: string | null;
  settings: WidgetSettings;
  spaceId: string;
};

/** Every action on a widget goes through its space: one that is not the signed-in creator's is not found. */
export const findOwnedWidget = async (
  database: Database,
  userId: string,
  widgetId: string,
): Promise<OwnedWidget | null> => {
  const [widget] = await database
    .select({
      id: widgets.id,
      type: widgets.type,
      productId: widgets.productId,
      settings: widgets.settings,
      spaceId: widgets.spaceId,
    })
    .from(widgets)
    .innerJoin(spaces, eq(spaces.id, widgets.spaceId))
    .where(and(eq(widgets.id, widgetId), eq(spaces.userId, userId)))
    .limit(1);
  return widget ?? null;
};

export type CreateWidgetResult =
  | { status: "created"; widgetId: string }
  | { status: "plan-limit" }
  | { status: "space-not-found" };

/** A new widget starts as a wall of every offer. The plan's limit is checked under a lock, so two clicks make one. */
export const createWidget = (database: Database, userId: string): Promise<CreateWidgetResult> =>
  database.transaction(async (transaction): Promise<CreateWidgetResult> => {
    await transaction.execute(sql`select pg_advisory_xact_lock(hashtext(${`create-widget:${userId}`}))`);
    const [space] = await transaction
      .select({ id: spaces.id, plan: spaces.plan })
      .from(spaces)
      .where(eq(spaces.userId, userId))
      .orderBy(asc(spaces.createdAt))
      .limit(1);
    if (!space) return { status: "space-not-found" };

    const [{ widgetCount }] = await transaction
      .select({ widgetCount: count() })
      .from(widgets)
      .where(eq(widgets.spaceId, space.id));
    if (!canCreateWidget(space, widgetCount)) return { status: "plan-limit" };

    const [widget] = await transaction
      .insert(widgets)
      .values({ spaceId: space.id, type: "wall" })
      .returning({ id: widgets.id });
    return { status: "created", widgetId: widget.id };
  });

export type UpdateWidgetResult = { status: "updated" } | { status: "widget-not-found" } | { status: "offer-not-found" };

/** Settings the editor does not show, like the radius of the cards, are kept as they are. */
export const updateWidget = async (
  database: Database,
  userId: string,
  widgetId: string,
  edit: WidgetEdit,
): Promise<UpdateWidgetResult> => {
  const widget = await findOwnedWidget(database, userId, widgetId);
  if (!widget) return { status: "widget-not-found" };
  if (edit.productId) {
    const [offer] = await database
      .select({ id: products.id })
      .from(products)
      .where(and(eq(products.id, edit.productId), eq(products.spaceId, widget.spaceId)))
      .limit(1);
    if (!offer) return { status: "offer-not-found" };
  }
  const [space] = await database.select({ plan: spaces.plan }).from(spaces).where(eq(spaces.id, widget.spaceId));

  const { type, productId, ...settings } = edit;
  await database
    .update(widgets)
    .set({
      type,
      productId,
      settings: { ...widget.settings, ...settings, hidePoweredBy: settings.hidePoweredBy && canHideBadge(space) },
    })
    .where(and(eq(widgets.id, widget.id), eq(widgets.spaceId, widget.spaceId)));
  return { status: "updated" };
};
