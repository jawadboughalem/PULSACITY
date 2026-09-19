/**
 * « Sites livrés » — real client sites only.
 *
 * `content/showcase.json` holds the entries; `pnpm showcase:shots` produces the
 * screenshots. An entry without a reachable URL is not an entry, and an empty file
 * makes the whole section disappear rather than invent a reference.
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { z } from 'zod';

import { slugify } from './utils';

export const ShowcaseEntrySchema = z.object({
  /** Client business name, exactly as it appears on the delivered site. */
  name: z.string().trim().min(1).max(120),
  /** Trade, e.g. « Garage 2-roues ». */
  sector: z.string().trim().min(1).max(80),
  city: z.string().trim().min(1).max(80),
  url: z.string().url(),
});

/** The section shows between 1 and 3 cards. */
export const ShowcaseSchema = z.array(ShowcaseEntrySchema).max(3);

export type ShowcaseEntry = z.infer<typeof ShowcaseEntrySchema>;

export interface ShowcaseCard extends ShowcaseEntry {
  slug: string;
  /** Present only when the screenshot has actually been generated. */
  desktopShot?: string;
  mobileShot?: string;
}

export const SHOWCASE_DIR = 'showcase';

export function desktopShotPath(slug: string): string {
  return `/${SHOWCASE_DIR}/${slug}-desktop.webp`;
}

export function mobileShotPath(slug: string): string {
  return `/${SHOWCASE_DIR}/${slug}-mobile.webp`;
}

/** Validates raw JSON. Throws with a readable message when the file is malformed. */
export function parseShowcase(raw: unknown): ShowcaseEntry[] {
  return ShowcaseSchema.parse(raw);
}

/**
 * Turns entries into renderable cards, attaching only screenshots that exist on disk
 * so a missing capture degrades to a text card instead of a broken image.
 */
export function toCards(entries: ShowcaseEntry[], publicDir: string): ShowcaseCard[] {
  return entries.map((entry) => {
    const slug = slugify(entry.name);
    const desktop = desktopShotPath(slug);
    const mobile = mobileShotPath(slug);
    return {
      ...entry,
      slug,
      ...(existsSync(join(publicDir, SHOWCASE_DIR, `${slug}-desktop.webp`))
        ? { desktopShot: desktop }
        : {}),
      ...(existsSync(join(publicDir, SHOWCASE_DIR, `${slug}-mobile.webp`))
        ? { mobileShot: mobile }
        : {}),
    };
  });
}
