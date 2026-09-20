/**
 * The maths behind the token guard.
 *
 * A guard whose arithmetic is wrong is worse than no guard: it would pass every
 * palette, including a broken one. These cases pin the conversion to values that
 * can be checked by hand.
 */
import { describe, expect, it } from 'vitest';

import {
  contrastRatio,
  floorToHundredth,
  isInGamut,
  parseOklch,
  relativeLuminance,
  toHex,
} from './contrast';

const oklch = (value: string) => {
  const parsed = parseOklch(value);
  if (!parsed) throw new Error(`not an oklch() colour: ${value}`);
  return parsed;
};

describe('parseOklch', () => {
  it('reads lightness, chroma and hue', () => {
    expect(parseOklch('oklch(0.58 0.19 32)')).toEqual({ l: 0.58, c: 0.19, h: 32, alpha: 1 });
  });

  it('reads an alpha channel', () => {
    expect(parseOklch('oklch(0.19 0.008 60 / 0.05)')?.alpha).toBeCloseTo(0.05, 5);
  });

  it('refuses anything that is not an oklch() colour', () => {
    for (const value of ['#fbfaf7', 'rgb(1 2 3)', 'var(--color-ink)', '0.5rem', '']) {
      expect(parseOklch(value)).toBeNull();
    }
  });
});

describe('toHex', () => {
  it('maps the extremes of the lightness axis', () => {
    expect(toHex(oklch('oklch(1 0 0)'))).toBe('#ffffff');
    expect(toHex(oklch('oklch(0 0 0)'))).toBe('#000000');
  });

  it('maps the palette to the sRGB the charter documents', () => {
    expect(toHex(oklch('oklch(0.985 0.004 85)'))).toBe('#fbfaf7');
    expect(toHex(oklch('oklch(0.19 0.008 60)'))).toBe('#171310');
    expect(toHex(oklch('oklch(0.58 0.19 32)'))).toBe('#d33e25');
    expect(toHex(oklch('oklch(0.22 0.012 55)'))).toBe('#1f1915');
  });
});

describe('isInGamut', () => {
  it('accepts the palette', () => {
    expect(isInGamut(oklch('oklch(0.96 0.02 40)'))).toBe(true);
    expect(isInGamut(oklch('oklch(0.58 0.19 32)'))).toBe(true);
  });

  it('rejects the chroma the palette used to carry', () => {
    // The V0 value of `accent-soft`: the browser clipped it, so the declared
    // colour was never the painted one.
    expect(isInGamut(oklch('oklch(0.96 0.03 40)'))).toBe(false);
  });
});

describe('relativeLuminance', () => {
  it('runs from 0 to 1 across the lightness axis', () => {
    expect(relativeLuminance(oklch('oklch(0 0 0)'))).toBeCloseTo(0, 6);
    expect(relativeLuminance(oklch('oklch(1 0 0)'))).toBeCloseTo(1, 6);
  });
});

describe('contrastRatio', () => {
  it('reaches the WCAG ceiling on black against white', () => {
    expect(contrastRatio(oklch('oklch(1 0 0)'), oklch('oklch(0 0 0)'))).toBeCloseTo(21, 6);
  });

  it('bottoms out at 1 for a colour against itself', () => {
    const ground = oklch('oklch(0.985 0.004 85)');
    expect(contrastRatio(ground, ground)).toBeCloseTo(1, 6);
  });

  it('does not depend on the order of its arguments', () => {
    const ink = oklch('oklch(0.19 0.008 60)');
    const ground = oklch('oklch(0.985 0.004 85)');
    expect(contrastRatio(ink, ground)).toBeCloseTo(contrastRatio(ground, ink), 12);
  });

  it('agrees with the ratio the charter publishes for ink on the ground', () => {
    const ratio = contrastRatio(oklch('oklch(0.19 0.008 60)'), oklch('oklch(0.985 0.004 85)'));
    expect(floorToHundredth(ratio)).toBe(17.69);
  });
});

describe('floorToHundredth', () => {
  it('rounds down, so a published ratio is never flattering', () => {
    expect(floorToHundredth(4.4999)).toBe(4.49);
    expect(floorToHundredth(17.6987)).toBe(17.69);
  });
});
