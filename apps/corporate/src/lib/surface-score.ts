/**
 * The surface score.
 *
 * The charter fixes which surface each *type* of section sits on, and one rule
 * decides the hairlines: a line separates two bands that share a surface, and
 * nothing else — where the surface changes, the change is already the
 * separation.
 *
 * Derived, never listed. The page knows the rule, so any order of sections gets
 * a coherent score, including orders nobody has written yet.
 */
import type { Section } from './lines';

export type Tone = 'ground' | 'inverted';

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

export interface ScoredSection {
  readonly section: Section;
  readonly tone: Tone;
  /** A hairline above this band, because the one before it shares its surface. */
  readonly divided: boolean;
}

export function toneOf(section: Section): Tone {
  return TONE_BY_TYPE[section.type];
}

/**
 * `before` is the tone of whatever already sits above these sections — the
 * previous line on a page that renders several. `undefined` means this is the
 * top of the document, which never takes a line.
 */
export function scoreSections(sections: readonly Section[], before?: Tone): ScoredSection[] {
  let previous = before;

  return sections.map((section) => {
    const tone = toneOf(section);
    const divided = previous !== undefined && previous === tone;
    previous = tone;
    return { section, tone, divided };
  });
}

/** The tone a following block has to reckon with — the footer, or the next line. */
export function lastTone(sections: readonly Section[], before?: Tone): Tone | undefined {
  const last = sections.at(-1);
  return last ? toneOf(last) : before;
}
