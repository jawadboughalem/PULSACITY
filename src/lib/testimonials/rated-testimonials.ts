import { type SQL, sql } from "drizzle-orm";
import { testimonials } from "@/db/schema";

/**
 * The rating of the badge and of the summaries counts every testimonial received, pending ones included, but those
 * hidden for a declared reason (positionnement.md, point 5): a testimonial hidden before « Masquer » asked for a
 * reason still counts.
 */
export const countsInRating: SQL = sql`not (${testimonials.status} = 'hidden' and ${testimonials.hiddenReason} is not null)`;
