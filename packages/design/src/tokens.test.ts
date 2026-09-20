import { describe, expect, it } from 'vitest';

import { readTokens } from './stylesheet';
import { HEX, OKLCH, oklchToCss, oklchToHex } from './tokens';

describe('oklchToHex', () => {
  // The three sRGB primaries and a mid grey, in OKLCH. If the matrices are wrong, these
  // are the first values to break.
  it.each([
    ['red', [0.62796, 0.25768, 29.234], '#ff0000'],
    ['green', [0.86644, 0.29483, 142.495], '#00ff00'],
    ['blue', [0.45201, 0.31321, 264.052], '#0000ff'],
    ['mid grey', [0.59987, 0, 0], '#808080'],
    ['white', [1, 0, 0], '#ffffff'],
    ['black', [0, 0, 0], '#000000'],
  ] as const)('converts %s', (_name, oklch, expected) => {
    expect(oklchToHex(oklch)).toBe(expected);
  });

  it('clips an out-of-gamut colour rather than throwing', () => {
    expect(oklchToHex([0.5, 0.4, 150])).toMatch(/^#[0-9a-f]{6}$/);
  });
});

describe('the two token files agree', () => {
  // tokens.css is what a browser reads; tokens.ts is what an image generator reads. A
  // value present in one and different in the other is the drift this test exists for.
  // The BASE block only. `.surface-inverted` redeclares these same names with other
  // values, so a flat scan of the file would compare the palette against the ink
  // context and fail on almost every colour.
  const cssColors = new Map(
    Object.entries(readTokens().base)
      .filter(([name]) => name.startsWith('--color-'))
      .map(([name, value]) => [name.slice('--color-'.length), value]),
  );

  const camelCase = (name: string) =>
    name.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

  it('declares the same colours on both sides', () => {
    expect([...cssColors.keys()].map(camelCase).sort()).toEqual(Object.keys(OKLCH).sort());
  });

  it.each([...cssColors.entries()])('%s has the same value', (name, css) => {
    const token = OKLCH[camelCase(name) as keyof typeof OKLCH];
    expect(token, `--color-${name} is missing from tokens.ts`).toBeDefined();
    expect(oklchToCss(token)).toBe(css);
  });
});

describe('HEX', () => {
  it('derives every token', () => {
    expect(Object.keys(HEX).sort()).toEqual(Object.keys(OKLCH).sort());
  });

  it('never returns anything but a six-digit hex string', () => {
    for (const value of Object.values(HEX)) expect(value).toMatch(/^#[0-9a-f]{6}$/);
  });
});
