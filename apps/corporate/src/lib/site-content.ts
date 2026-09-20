/**
 * `content/site.json` — everything the page says about PULSACITY itself.
 *
 * The brand, the founder, how to reach us. Changing any of it is a content edit,
 * never a code change.
 */
import { readFileSync } from 'node:fs';

import { hasPlaceholder } from '@pulsacity/templates/placeholders';
import { z } from 'zod';

import { contentDir } from './content-paths';

/** `.refine` returns an effect, so length bounds are applied before it, not after. */
const text = (max: number, min = 0) =>
  z
    .string()
    .trim()
    .min(min)
    .max(max)
    .refine((value) => !hasPlaceholder(value), {
      message: 'Texte non remplacé : le contenu contient encore un marqueur {{...}}',
    });

/** Present, or deliberately empty — an empty value is omitted from the page. */
const optional = (max: number) => text(max).default('');

export const SiteSchema = z.object({
  brand: text(40, 1),
  /** Shown as the person behind the offer. Empty means not shown at all. */
  founderFirstName: optional(40),
  /** How fast a request is called back, e.g. « sous 24 h ». */
  callbackDelay: text(40, 1),
  contact: z.object({
    email: z.union([z.string().email(), z.literal('')]).default(''),
    phone: optional(30),
  }),
  legalLinks: z
    .array(z.object({ href: z.string().startsWith('/'), label: text(40, 1) }))
    .default([]),
});

export type Site = z.infer<typeof SiteSchema>;

let cached: Site | undefined;

export function loadSite(): Site {
  cached ??= SiteSchema.parse(JSON.parse(readFileSync(contentDir('site.json'), 'utf8')));
  return cached;
}
