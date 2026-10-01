import { asc, eq } from "drizzle-orm";
import type { Database } from "@/db/database";
import { widgets } from "@/db/schema";

export const findDefaultWidgetId = async (database: Database, spaceId: string): Promise<string | null> => {
  const [widget] = await database
    .select({ id: widgets.id })
    .from(widgets)
    .where(eq(widgets.spaceId, spaceId))
    .orderBy(asc(widgets.createdAt))
    .limit(1);
  return widget?.id ?? null;
};
