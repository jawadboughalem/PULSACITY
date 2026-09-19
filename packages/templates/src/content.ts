/**
 * `SiteContent` — the contract between content production and rendering.
 *
 * Trade-specific templates land in S2. They will replace `renderSite`, not this
 * contract: anything that reads a site reads this shape.
 */
import { z } from 'zod';

import { hasPlaceholder } from './placeholders';

/** A string that is present, trimmed, and free of unreplaced `{{...}}` markers. */
const filledText = (max = 2000) =>
  z
    .string()
    .trim()
    .min(1)
    .max(max)
    .refine((value) => !hasPlaceholder(value), {
      message: 'Texte non remplacé : le contenu contient encore un marqueur {{...}}',
    });

const optionalText = (max = 2000) => filledText(max).optional();

export const ServiceSchema = z.object({
  name: filledText(120),
  /** Short factual description. Never a sales pitch, never an invented figure. */
  description: optionalText(600),
  /** Free text, e.g. « à partir de 45 € ». Absent when the client gives no price. */
  price: optionalText(80),
});

export const FaqEntrySchema = z.object({
  question: filledText(300),
  answer: filledText(1500),
});

/** One line of opening hours. `hours` is free text so « Fermé » stays expressible. */
export const OpeningHoursEntrySchema = z.object({
  day: filledText(20),
  hours: filledText(120),
});

export const ReviewSchema = z.object({
  author: filledText(120),
  rating: z.number().int().min(1).max(5),
  text: filledText(1500),
  /** ISO date (YYYY-MM-DD) when the Google listing provides one. */
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
});

export const PhotoSchema = z.object({
  url: z.string().url(),
  alt: filledText(200),
});

export const SiteContentSchema = z.object({
  headline: filledText(160),
  intro: filledText(1200),
  services: z.array(ServiceSchema).default([]),
  faq: z.array(FaqEntrySchema).default([]),
  openingHours: z.array(OpeningHoursEntrySchema).default([]),
  /** Display form, e.g. « 01 23 45 67 89 ». The renderer derives the `tel:` link. */
  phone: optionalText(40),
  address: optionalText(300),
  mapsUrl: z.string().url().optional(),
  reviews: z.array(ReviewSchema).default([]),
  photos: z.array(PhotoSchema).default([]),
});

export type Service = z.infer<typeof ServiceSchema>;
export type FaqEntry = z.infer<typeof FaqEntrySchema>;
export type OpeningHoursEntry = z.infer<typeof OpeningHoursEntrySchema>;
export type Review = z.infer<typeof ReviewSchema>;
export type Photo = z.infer<typeof PhotoSchema>;
export type SiteContent = z.infer<typeof SiteContentSchema>;

/** Parses unknown JSON (a `sites.content` column) into a `SiteContent`. Throws on failure. */
export function parseSiteContent(value: unknown): SiteContent {
  return SiteContentSchema.parse(value);
}

/** Non-throwing variant, for callers that prefer to degrade gracefully. */
export function safeParseSiteContent(value: unknown) {
  return SiteContentSchema.safeParse(value);
}
