/**
 * The band plan is the one piece of the page that is *reasoning* rather than
 * markup, so it is the piece worth testing. The last blocks check the real
 * content against the charter's rules, in both of the states it can be in —
 * with a delivered site to show, and without.
 */
import { describe, expect, it } from 'vitest';

import type { Section } from './lines';
import { liveLines } from './lines';
import {
  anchorsOf,
  contentAnchors,
  lastTone,
  planSections,
  rendersSection,
  toneOf,
} from './surface-score';

const of = (...types: Section['type'][]) => types.map((type) => ({ type }) as Section);
const empty = { hasCards: false };
const full = { hasCards: true };
const pattern = (plan: ReturnType<typeof planSections>) =>
  plan.map((band) => `${band.tone}${band.divided ? '+line' : ''}`);

describe('planSections', () => {
  it('never draws a line at the top of the document', () => {
    expect(planSections(of('hero'), full)[0]?.divided).toBe(false);
  });

  it('draws a line between two bands that share a surface', () => {
    expect(pattern(planSections(of('hero', 'features'), full))).toEqual(['ground', 'ground+line']);
  });

  it('draws none where the surface changes', () => {
    expect(pattern(planSections(of('features', 'showcase', 'steps'), full))).toEqual([
      'ground',
      'inverted',
      'ground',
    ]);
  });

  it('treats the price band as paper, because its inset floats on it', () => {
    expect(pattern(planSections(of('steps', 'pricing', 'faq'), full))).toEqual([
      'ground',
      'ground+line',
      'ground+line',
    ]);
  });

  it('carries the tone across a boundary, so a second line keeps the rule', () => {
    const first = of('hero', 'cta');
    const second = of('cta', 'faq');
    const before = lastTone(first, full);
    expect(pattern(planSections(second, { ...full, before }))).toEqual(['inverted+line', 'ground']);
  });

  it('gives the FAQ a narrower column and leaves the rest wide', () => {
    const [faq, hero] = planSections(of('faq', 'hero'), full);
    expect(faq?.width).toBe('narrow');
    expect(hero?.width).toBe('wide');
  });
});

describe('a section that draws nothing is not a band', () => {
  const bare = { type: 'showcase', title: 'Un site livré' } as Section;
  const withEmpty = {
    type: 'showcase',
    title: 'Un site livré',
    empty: { text: 'Rien pour le moment.', items: ['Accueil'] },
  } as Section;

  it('drops a showcase with nothing to show and no empty block', () => {
    expect(rendersSection(bare, false)).toBe(false);
    expect(planSections([bare], empty)).toEqual([]);
  });

  it('keeps it as soon as the line says what to show instead', () => {
    expect(rendersSection(withEmpty, false)).toBe(true);
  });

  it('keeps it once a site has been delivered', () => {
    expect(rendersSection(bare, true)).toBe(true);
  });

  it('does not let the dropped band leave a hairline behind it', () => {
    // features and steps both sit on paper, so the line belongs between them —
    // not computed against a showcase that never reached the page.
    expect(pattern(planSections(of('features', 'showcase', 'steps'), empty))).toEqual([
      'ground',
      'ground+line',
    ]);
  });
});

describe('the real content obeys the charter', () => {
  const sections = liveLines().flatMap((line) => line.sections);

  it('has something to check', () => {
    expect(sections.length).toBeGreaterThan(0);
  });

  for (const [label, options] of [
    ['sans site livré', empty],
    ['avec un site livré', full],
  ] as const) {
    describe(label, () => {
      const plan = planSections(sections, options);
      const inked = plan.filter((band) => band.tone === 'inverted');

      it('keeps at most two inked blocks on the page', () => {
        expect(inked.length).toBeLessThanOrEqual(2);
      });

      it('never puts two inked blocks side by side', () => {
        const adjacent = plan
          .map((band, index) => [band, plan[index - 1]] as const)
          .filter(([band, previous]) => band.tone === 'inverted' && previous?.tone === 'inverted')
          .map(([band]) => band.section.type);

        expect(adjacent).toEqual([]);
      });

      it('starts on the paper, so no inked block touches the top edge', () => {
        expect(plan.at(0)?.tone).toBe('ground');
      });

      it('spends the inked blocks on what is sold, then on the way out', () => {
        expect(inked.map((band) => band.section.type)).toEqual(['showcase', 'cta']);
      });

      it('leads nowhere dead: every anchor the content links to is rendered', () => {
        const offered = anchorsOf(sections, options);
        const missing = contentAnchors(sections).filter((anchor) => !offered.includes(anchor));
        expect(missing).toEqual([]);
      });
    });
  }

  it('ends inked only because paper follows it', () => {
    // The line closes on its call to action, which is inked. The bottom edge of
    // the document is still paper: the "À venir" band and the footer come after,
    // and both are ground by construction.
    expect(lastTone(sections, empty)).toBe('inverted');
  });
});

describe('toneOf', () => {
  it('gives every section type a surface', () => {
    const types: Section['type'][] = [
      'hero',
      'features',
      'showcase',
      'steps',
      'pricing',
      'faq',
      'cta',
    ];
    for (const type of types) expect(toneOf({ type } as Section)).toMatch(/^(ground|inverted)$/);
  });
});
