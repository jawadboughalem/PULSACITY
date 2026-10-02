import { asc, eq } from "drizzle-orm";
import type { Database } from "@/db/database";
import { widgets } from "@/db/schema";
import type { WidgetType } from "../../../widget/src/payload";

export type DefaultWidget = { id: string; type: WidgetType };

/** The first widget of the space: the one the home of the space hands out. */
export const findDefaultWidget = async (database: Database, spaceId: string): Promise<DefaultWidget | null> => {
  const [widget] = await database
    .select({ id: widgets.id, type: widgets.type })
    .from(widgets)
    .where(eq(widgets.spaceId, spaceId))
    .orderBy(asc(widgets.createdAt))
    .limit(1);
  return widget ?? null;
};
