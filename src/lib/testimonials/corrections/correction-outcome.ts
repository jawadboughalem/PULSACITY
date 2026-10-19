/** What became of a correction proposed to the author: null while it waits for an answer. */
export type CorrectionOutcome = "accepted" | "refused" | "cancelled";

/**
 * At most this many corrections are proposed for one testimonial, whatever their answer: like the request and its
 * reminder (CLAUDE.md, règle n° 4), the author is never asked more than twice.
 */
export const MAX_CORRECTIONS_PER_TESTIMONIAL = 2;
