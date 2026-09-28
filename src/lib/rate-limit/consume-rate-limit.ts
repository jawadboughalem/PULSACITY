import { sql } from "drizzle-orm";
import type { Database } from "@/db/database";
import { rateLimits } from "@/db/schema";

export type RateLimitRule = {
  name: string;
  limit: number;
  windowSeconds: number;
};

export const consumeRateLimit = async (
  database: Database,
  rule: RateLimitRule,
  subject: string,
): Promise<boolean> => {
  const isWindowOver = sql`${rateLimits.windowStartedAt} <= now() - make_interval(secs => ${rule.windowSeconds})`;
  const [row] = await database
    .insert(rateLimits)
    .values({ key: `${rule.name}:${subject}`, hits: 1, windowStartedAt: sql`now()` })
    .onConflictDoUpdate({
      target: rateLimits.key,
      set: {
        hits: sql`case when ${isWindowOver} then 1 else ${rateLimits.hits} + 1 end`,
        windowStartedAt: sql`case when ${isWindowOver} then now() else ${rateLimits.windowStartedAt} end`,
      },
    })
    .returning({ hits: rateLimits.hits });
  return row.hits <= rule.limit;
};
