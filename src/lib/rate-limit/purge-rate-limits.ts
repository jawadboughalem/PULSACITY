import { lt, sql } from "drizzle-orm";
import type { Database } from "@/db/database";
import { rateLimits } from "@/db/schema";

/**
 * The longest window of the rules (« Écrivez-nous », 30 messages a day). A counter whose window started longer ago
 * counts nothing any more: it goes, so that the privacy policy's « 48 heures au plus » holds with a daily run.
 */
export const LONGEST_RATE_LIMIT_WINDOW_SECONDS = 24 * 60 * 60;

/** Deletes the counters past their window; their keys hold pseudonymous subjects (an HMAC of an IP or an address). */
export const purgeEndedRateLimits = async (database: Database): Promise<number> => {
  const purged = await database
    .delete(rateLimits)
    .where(
      lt(rateLimits.windowStartedAt, sql`now() - make_interval(secs => ${LONGEST_RATE_LIMIT_WINDOW_SECONDS})`),
    )
    .returning({ key: rateLimits.key });
  return purged.length;
};
