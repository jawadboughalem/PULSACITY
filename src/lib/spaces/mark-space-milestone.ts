import { and, eq, isNull } from "drizzle-orm";
import type { Database } from "@/db/database";
import { spaces } from "@/db/schema";

export const SPACE_MILESTONES = ["collection-link-shared", "first-day-celebrated"] as const;

export type SpaceMilestone = (typeof SPACE_MILESTONES)[number];

const MILESTONE_COLUMNS = {
  "collection-link-shared": spaces.collectionLinkSharedAt,
  "first-day-celebrated": spaces.firstDayCelebratedAt,
} as const;

const MILESTONE_FIELDS = {
  "collection-link-shared": "collectionLinkSharedAt",
  "first-day-celebrated": "firstDayCelebratedAt",
} as const;

/** Only the first time counts: a milestone keeps its first date. */
export const markSpaceMilestone = async (
  database: Database,
  userId: string,
  milestone: SpaceMilestone,
  now = new Date(),
): Promise<void> => {
  await database
    .update(spaces)
    .set({ [MILESTONE_FIELDS[milestone]]: now })
    .where(and(eq(spaces.userId, userId), isNull(MILESTONE_COLUMNS[milestone])));
};
