import { inArray } from "drizzle-orm";
import type { Database } from "@/db/database";
import { spaces } from "@/db/schema";
import { appendSlugSuffix } from "./slugify";

const NUMBERED_SUGGESTIONS = Array.from({ length: 19 }, (_, index) => String(index + 2));

export const suggestAvailableSpaceSlug = async (database: Database, slug: string): Promise<string> => {
  const candidates = NUMBERED_SUGGESTIONS.map((suffix) => appendSlugSuffix(slug, suffix));
  const taken = await database
    .select({ slug: spaces.slug })
    .from(spaces)
    .where(inArray(spaces.slug, candidates));
  const takenSlugs = new Set(taken.map((space) => space.slug));
  return (
    candidates.find((candidate) => !takenSlugs.has(candidate)) ??
    appendSlugSuffix(slug, String(Date.now()).slice(-6))
  );
};
