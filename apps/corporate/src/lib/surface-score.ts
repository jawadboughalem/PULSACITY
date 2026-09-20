/**
 * How a section becomes a band.
 *
 * Its surface, whether a hairline falls above it, how wide its column is, and
 * the anchor the content may link to. All of it derived: the charter fixes which
 * surface each *type* sits on, and one rule decides the lines — a line separates
 * two bands that share a surface, and nothing else, because where the surface
 * changes the change is already the separation.
 *
 * Written as a rule rather than a list, so any order of sections gets a coherent
 * page, including orders nobody has written yet.
 */
import type { Section } from './lines';

export type Tone = 'ground' | 'inverted';
export type BandWidth = 'measure' | 'narrow' | 'wide';

/**
 * `pricing` is the subtle one: the band stays paper and the *inset* is sunken.
 * A sunken block laid on the paper has not changed the floor, so the section
 * after it is still separated by a line.
 */
const TONE_BY_TYPE: Record<Section['type'], Tone> = {
  hero: 'ground',
  features: 'ground',
  showcase: 'inverted',
  steps: 'ground',
  pricing: 'ground',
  faq: 'ground',
  cta: 'inverted',
};

/** Anchors the content links to, e.g. « Voir un site livré » → `#realisations`. */
const ANCHOR_BY_TYPE: Partial<Record<Section['type'], string>> = {
  showcase: 'realisations',
  steps: 'methode',
  faq: 'faq',
};

/** Long-form questions read better in a narrower column. */
const WIDTH_BY_TYPE: Partial<Record<Section['type'], BandWidth>> = { faq: 'narrow' };

export interface BandPlan {
  readonly section: Section;
  readonly tone: Tone;
  /** A hairline above this band, because the one before it shares its surface. */
  readonly divided: boolean;
  readonly anchor: string | undefined;
  readonly width: BandWidth;
}

export function toneOf(section: Section): Tone {
  return TONE_BY_TYPE[section.type];
}

/**
 * Whether a section draws anything at all.
 *
 * A section that would draw nothing must not reach the score: it would leave an
 * empty band — its padding, and a hairline computed against a surface nobody can
 * see. Only the showcase can come out empty, when nothing has been delivered and
 * the line declares no `empty` block to show instead.
 */
export function rendersSection(section: Section, hasCards: boolean): boolean {
  if (section.type !== 'showcase') return true;
  return hasCards || section.empty !== undefined;
}

export interface PlanOptions {
  /** Whether `content/showcase.json` has a delivered site to show. */
  hasCards: boolean;
  /** The tone of whatever already sits above — the previous line on a page that
   *  renders several. `undefined` means the top of the document, which never
   *  takes a line. */
  before?: Tone;
}

export function planSections(
  sections: readonly Section[],
  { hasCards, before }: PlanOptions,
): BandPlan[] {
  let previous = before;

  return sections
    .filter((section) => rendersSection(section, hasCards))
    .map((section) => {
      const tone = toneOf(section);
      const divided = previous !== undefined && previous === tone;
      previous = tone;

      return {
        section,
        tone,
        divided,
        anchor: ANCHOR_BY_TYPE[section.type],
        width: WIDTH_BY_TYPE[section.type] ?? 'wide',
      };
    });
}

/** The tone a following block has to reckon with — the footer, or the next line. */
export function lastTone(
  sections: readonly Section[],
  { hasCards, before }: PlanOptions,
): Tone | undefined {
  return planSections(sections, { hasCards, before }).at(-1)?.tone ?? before;
}

/** The anchors the rendered page will actually offer. */
export function anchorsOf(sections: readonly Section[], options: PlanOptions): string[] {
  return planSections(sections, options)
    .map((band) => band.anchor)
    .filter((anchor): anchor is string => anchor !== undefined);
}

/**
 * The in-page anchors the content links to. A link to a section that does not
 * render is a link that goes nowhere — see `surface-score.test.ts`.
 */
export function contentAnchors(sections: readonly Section[]): string[] {
  const found = new Set<string>();

  for (const section of sections) {
    const hrefs = [
      section.type === 'hero' ? section.primary.href : undefined,
      section.type === 'hero' ? section.secondary?.href : undefined,
      section.type === 'pricing' ? section.action.href : undefined,
      section.type === 'cta' ? section.action.href : undefined,
    ];

    for (const href of hrefs) {
      if (href?.startsWith('#')) found.add(href.slice(1));
    }
  }

  return [...found];
}
