import { and, eq, isNull } from "drizzle-orm";
import type { Database } from "@/db/database";
import { spaces } from "@/db/schema";

/** True for the first validated testimonial of the space only: the moment is recorded as it is claimed. */
export const claimFirstApproval = async (database: Database, spaceId: string, now: Date): Promise<boolean> => {
  const claimed = await database
    .update(spaces)
    .set({ firstApprovalCelebratedAt: now })
    .where(and(eq(spaces.id, spaceId), isNull(spaces.firstApprovalCelebratedAt)))
    .returning({ id: spaces.id });
  return claimed.length > 0;
};
