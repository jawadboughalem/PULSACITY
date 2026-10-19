import { and, eq, isNull } from "drizzle-orm";
import type { Database } from "@/db/database";
import { testimonialCorrections, testimonials } from "@/db/schema";
import { getDisplayedBody } from "../displayed-body";
import { findOwnedTestimonial } from "../find-owned-testimonial";

export type MaskedPassageKind = "name" | "contact";

/** Written in the displayed text in place of the passage: the fiche shows it as a pill, the widgets as it is. */
export const MASKED_PASSAGE_TEXT: Record<MaskedPassageKind, string> = {
  name: "[nom masqué]",
  contact: "[coordonnée masquée]",
};

/**
 * A name or a coordinate, not a sentence: without the author's agreement, nothing else may change (positionnement.md,
 * point 4). An e-mail address or a web address fits.
 */
export const MAX_MASKED_PASSAGE_LENGTH = 100;

export type MaskPassageInput = {
  /** The displayed text the creator selected in, to refuse a selection made on a text changed since. */
  text: string;
  start: number;
  end: number;
  kind: MaskedPassageKind;
};

export type MaskPassageResult =
  | { status: "masked" }
  | { status: "testimonial-not-found" }
  | { status: "text-changed" }
  | { status: "empty-passage" }
  | { status: "passage-too-long" }
  | { status: "correction-waiting" };

const MASK_PATTERN = /\[(?:nom masqué|coordonnée masquée)\]/g;

/** The passages already masked in a text, to show them as pills. */
export const splitMaskedPassages = (text: string): { text: string; isMasked: boolean }[] => {
  const parts: { text: string; isMasked: boolean }[] = [];
  let last = 0;
  for (const match of text.matchAll(MASK_PATTERN)) {
    if (match.index > last) parts.push({ text: text.slice(last, match.index), isMasked: false });
    parts.push({ text: match[0].slice(1, -1), isMasked: true });
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push({ text: text.slice(last), isMasked: false });
  return parts;
};

/**
 * « Masquer un nom ou une coordonnée » (maquettes 3.4, fiche 12 et 13): the passage is replaced in the displayed text
 * only, no agreement needed, the original kept as is. Not while a correction waits for the author: their answer
 * would bring the passage back.
 */
export const maskPassage = async (
  database: Database,
  userId: string,
  testimonialId: string,
  { text, start, end, kind }: MaskPassageInput,
  now = new Date(),
): Promise<MaskPassageResult> => {
  const owned = await findOwnedTestimonial(database, userId, testimonialId);
  if (!owned) return { status: "testimonial-not-found" };

  const [current] = await database
    .select({ body: testimonials.body, displayBody: testimonials.displayBody })
    .from(testimonials)
    .where(eq(testimonials.id, owned.id));
  const shown = getDisplayedBody(current);
  if (shown !== text || start < 0 || end > shown.length || start >= end) {
    return shown === text ? { status: "empty-passage" } : { status: "text-changed" };
  }

  // The spaces around the selection stay: only the passage itself is replaced.
  const selected = shown.slice(start, end);
  const from = start + (selected.length - selected.trimStart().length);
  const to = end - (selected.length - selected.trimEnd().length);
  const passage = shown.slice(from, to);
  if (passage === "" || [...passage.matchAll(MASK_PATTERN)].length > 0) return { status: "empty-passage" };
  if (passage.length > MAX_MASKED_PASSAGE_LENGTH || passage.includes("\n")) return { status: "passage-too-long" };

  const [waiting] = await database
    .select({ id: testimonialCorrections.id })
    .from(testimonialCorrections)
    .where(and(eq(testimonialCorrections.testimonialId, owned.id), isNull(testimonialCorrections.outcome)))
    .limit(1);
  if (waiting) return { status: "correction-waiting" };

  await database
    .update(testimonials)
    .set({ displayBody: `${shown.slice(0, from)}${MASKED_PASSAGE_TEXT[kind]}${shown.slice(to)}`, displayEditedAt: now })
    .where(and(eq(testimonials.id, owned.id), eq(testimonials.spaceId, owned.spaceId)));
  return { status: "masked" };
};
