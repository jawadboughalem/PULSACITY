import { asc, eq } from "drizzle-orm";
import type { Database } from "@/db/database";
import { spaces } from "@/db/schema";

export type OwnedSpace = typeof spaces.$inferSelect;

export const findOwnedSpace = async (database: Database, userId: string): Promise<OwnedSpace | null> => {
  const [space] = await database
    .select()
    .from(spaces)
    .where(eq(spaces.userId, userId))
    .orderBy(asc(spaces.createdAt))
    .limit(1);
  return space ?? null;
};
