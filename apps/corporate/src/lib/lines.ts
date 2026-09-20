/**
 * Offer lines — `content/lines/<slug>.json`.
 *
 * A line is one thing PULSACITY sells, described entirely in content: its texts, its
 * sections, and its price. The page knows how to render section *types*; it knows
 * nothing about what is being sold. Adding a line is adding a file.
 */
import { readFileSync, readdirSync } from 'node:fs';

import { hasPlaceholder } from '@pulsacity/templates/placeholders';
import { z } from 'zod';

import { contentDir } from './content-paths';

const text = (max: number) =>
  z
    .string()
    .trim()
    .min(1)
    .max(max)
    .refine((value) => !hasPlaceholder(value), {
      message: 'Texte non remplacé : le contenu contient encore un marqueur {{...}}',
    });

const ActionSchema = z.object({
  label: text(60),
  /** An internal path or an in-page anchor; never an external URL. */
  href: z.string().regex(/^(\/|#)/),
});

const HeroSectionSchema = z.object({
  type: z.literal('hero'),
  title: text(120),
  text: text(600),
  primary: ActionSchema,
  secondary: ActionSchema.optional(),
});

const FeaturesSectionSchema = z.object({
  type: z.literal('features'),
  title: text(120).optional(),
  items: z.array(z.object({ title: text(80), text: text(600) })).min(1),
});

/**
 * Renders `content/showcase.json`.
 *
 * `empty` is what the section says before a single site has been delivered — the
 * page's main argument must not become a hole. It lives here rather than in a
 * component because the page knows nothing about what is being sold. A line that
 * omits it keeps the old behaviour: the section is left out rather than filled
 * with something invented (rule 9).
 */
const ShowcaseSectionSchema = z.object({
  type: z.literal('showcase'),
  title: text(120),
  empty: z
    .object({
      text: text(300),
      /** What the delivered site will contain — named, not promised. */
      items: z.array(text(60)).min(1).max(8),
    })
    .optional(),
});

const StepsSectionSchema = z.object({
  type: z.literal('steps'),
  title: text(120),
  items: z.array(z.object({ title: text(160), text: text(400) })).min(1),
});

const PricingSectionSchema = z.object({
  type: z.literal('pricing'),
  title: text(120),
  headline: text(120),
  text: text(1200),
  action: ActionSchema,
});

const FaqSectionSchema = z.object({
  type: z.literal('faq'),
  title: text(120),
  items: z.array(z.object({ question: text(300), answer: text(1500) })).min(1),
});

const CtaSectionSchema = z.object({
  type: z.literal('cta'),
  title: text(120),
  text: text(400),
  action: ActionSchema,
});

export const SectionSchema = z.discriminatedUnion('type', [
  HeroSectionSchema,
  FeaturesSectionSchema,
  ShowcaseSectionSchema,
  StepsSectionSchema,
  PricingSectionSchema,
  FaqSectionSchema,
  CtaSectionSchema,
]);

export type Section = z.infer<typeof SectionSchema>;

/**
 * The order journey, in the line's own words.
 *
 * `/commander`, `/commander/merci` and `/merci` describe what is being sold —
 * what you get, when it goes live, what the invoice looks like. That is offer
 * copy, so it lives here rather than in the pages (rule 1). The pages add one
 * sentence of their own, built from `site.callbackDelay`, which is brand-level
 * and stays the single source of that value.
 */
const JourneySchema = z.object({
  /** `/commander` — the brief form. */
  brief: z.object({ title: text(120), text: text(400) }),
  /** `/commander/merci` — the brief is in, payment is still optional. */
  sent: z.object({
    title: text(120),
    text: text(600),
    payNowTitle: text(120),
    payNowText: text(300),
  }),
  /** `/merci` — Stripe came back happy. */
  paid: z.object({
    title: text(120),
    text: text(300),
    steps: z.array(text(200)).min(1).max(6),
  }),
});

export type Journey = z.infer<typeof JourneySchema>;

/** What a line costs. Read server-side at checkout; never sent by the browser. */
export const OfferSchema = z.object({
  priceHtCents: z.number().int().positive(),
  renewalHtCents: z.number().int().nonnegative().optional(),
  extraChangeHtCents: z.number().int().nonnegative().optional(),
  productLabel: text(200),
});

export type Offer = z.infer<typeof OfferSchema>;

export const LineSchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9][a-z0-9-]{0,60}$/),
    order: z.number().int().nonnegative(),
    status: z.enum(['live', 'coming']),
    title: text(80),
    tagline: text(300),
    offer: OfferSchema.optional(),
    journey: JourneySchema.optional(),
    sections: z.array(SectionSchema).default([]),
  })
  .superRefine((line, ctx) => {
    if (line.status === 'live') {
      if (line.sections.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Une ligne live doit avoir des sections.',
        });
      }
      if (!line.journey) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Une ligne live doit décrire son parcours de commande (journey).',
        });
      }
      if (!line.offer) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Une ligne live doit déclarer son offre.',
        });
      }
    } else if (line.sections.length > 0) {
      // A line still in preparation says one sentence and promises nothing else.
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Une ligne « coming » se limite à sa phrase : pas de sections.',
      });
    }
  });

export type Line = z.infer<typeof LineSchema>;

let cached: Line[] | undefined;

/** Every line, validated and ordered. Throws on a malformed file, at build time. */
export function loadLines(): Line[] {
  if (cached) return cached;

  const directory = contentDir('lines');
  cached = readdirSync(directory)
    .filter((file) => file.endsWith('.json'))
    .map((file) => {
      const parsed = LineSchema.safeParse(
        JSON.parse(readFileSync(contentDir('lines', file), 'utf8')),
      );
      if (!parsed.success) {
        throw new Error(
          `content/lines/${file} invalide : ${parsed.error.issues[0]?.message ?? ''}`,
        );
      }
      return parsed.data;
    })
    .sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug));

  return cached;
}

export function liveLines(): Line[] {
  return loadLines().filter((line) => line.status === 'live');
}

export function comingLines(): Line[] {
  return loadLines().filter((line) => line.status === 'coming');
}

export function findLine(slug: string): Line | undefined {
  return loadLines().find((line) => line.slug === slug);
}

/** The offer behind a checkout request, or `undefined` when the slug sells nothing. */
export function findOffer(slug: string): Offer | undefined {
  const line = findLine(slug);
  return line?.status === 'live' ? line.offer : undefined;
}
