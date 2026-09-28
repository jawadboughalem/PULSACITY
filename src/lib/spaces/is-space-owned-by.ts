import { and, eq } from "drizzle-orm";
import type { Database } from "@/db/database";
import { spaces } from "@/db/schema";

export const isSpaceOwnedBy = async (database: Database, userId: string, spaceId: string): Promise<boolean> => {
  const [space] = await database
    .select({ id: spaces.id })
    .from(spaces)
    .where(and(eq(spaces.id, spaceId), eq(spaces.userId, userId)))
    .limit(1);
  return space !== undefined;
};
