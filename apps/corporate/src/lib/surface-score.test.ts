/**
 * The score is the one piece of the page that is *reasoning* rather than markup,
 * so it is the piece worth testing. The last block checks the real content
 * against the charter's five rules — a section added to a line that broke one of
 * them would fail here rather than on the page.
 */
import { describe, expect, it } from 'vitest';

import type { Section } from './lines';
import { liveLines } from './lines';
import { lastTone, scoreSections, toneOf } from './surface-score';

const of = (...types: Section['type'][]) => types.map((type) => ({ type }) as Section);
const pattern = (scored: ReturnType<typeof scoreSections>) =>
  scored.map((entry) => `${entry.tone}${entry.divided ? '+line' : ''}`);

describe('scoreSections', () => {
  it('never draws a line at the top of the document', () => {
    expect(scoreSections(of('hero'))[0]?.divided).toBe(false);
  });

  it('draws a line between two bands that share a surface', () => {
    expect(pattern(scoreSections(of('hero', 'features')))).toEqual(['ground', 'ground+line']);
  });

  it('draws none where the surface changes', () => {
    expect(pattern(scoreSections(of('features', 'showcase', 'steps')))).toEqual([
      'ground',
      'inverted',
      'ground',
    ]);
  });

  it('treats the price band as paper, because its inset floats on it', () => {
    expect(pattern(scoreSections(of('steps', 'pricing', 'faq')))).toEqual([
      'ground',
      'ground+line',
      'ground+line',
    ]);
  });

  it('carries the tone across a boundary, so a second line keeps the rule', () => {
    const first = of('hero', 'cta');
    const second = of('cta', 'faq');
    expect(pattern(scoreSections(second, lastTone(first)))).toEqual(['inverted+line', 'ground']);
  });
});

describe('the real content obeys the charter', () => {
  const sections = liveLines().flatMap((line) => line.sections);
  const scored = scoreSections(sections);
  const inked = scored.filter((entry) => entry.tone === 'inverted');

  it('has something to check', () => {
    expect(sections.length).toBeGreaterThan(0);
  });

  it('keeps at most two inked blocks on the page', () => {
    expect(inked.length).toBeLessThanOrEqual(2);
  });

  it('never puts two inked blocks side by side', () => {
    const adjacent = scored
      .map((entry, index) => [entry, scored[index - 1]] as const)
      .filter(([entry, previous]) => entry.tone === 'inverted' && previous?.tone === 'inverted')
      .map(([entry]) => entry.section.type);

    expect(adjacent).toEqual([]);
  });

  it('starts on the paper, so no inked block touches the top edge', () => {
    expect(scored.at(0)?.tone).toBe('ground');
  });

  it('ends inked only because paper follows it', () => {
    // The line closes on its call to action, which is inked. The bottom edge of
    // the document is still paper: the "À venir" band and the footer come after,
    // and both are ground by construction. If that ever stops being true, the
    // charter's fifth rule breaks and this is where to look.
    expect(lastTone(sections)).toBe('inverted');
    expect(scored.at(-1)?.section.type).toBe('cta');
  });

  it('spends the inked blocks on what is sold, then on the way out', () => {
    expect(inked.map((entry) => entry.section.type)).toEqual(['showcase', 'cta']);
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
