import { existsSync, readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { PNG_ASSETS, REPO_ROOT, SVG_ASSETS } from './brand-assets';
import { MARK, MARK_COMPACT, MARK_SAFE_MARGIN, MARK_VIEWBOX } from './logo';
import { HEX } from './tokens';

const relative = (path: string) => path.replace(`${REPO_ROOT}/`, '');

describe('the committed brand files match the generator', () => {
  // Run `pnpm brand:assets` when this fails. Never edit the files by hand.
  it.each(SVG_ASSETS.map((asset) => [relative(asset.path), asset] as const))(
    '%s',
    (_name, asset) => {
      expect(existsSync(asset.path), `${relative(asset.path)} is missing`).toBe(true);
      expect(readFileSync(asset.path, 'utf8')).toBe(asset.contents);
    },
  );

  it.each(PNG_ASSETS.map((asset) => [relative(asset.path), asset] as const))(
    '%s exists',
    (_name, asset) => {
      expect(existsSync(asset.path), `${relative(asset.path)} is missing`).toBe(true);
      // A PNG header, so a truncated or half-written file is caught.
      expect(readFileSync(asset.path).subarray(1, 4).toString()).toBe('PNG');
      expect(asset.size).toBeGreaterThan(0);
    },
  );
});

describe('the mark stays inside its grid', () => {
  it.each([
    ['standard', MARK],
    ['compact', MARK_COMPACT],
  ] as const)('%s keeps every block on the canvas', (_name, blocks) => {
    for (const block of blocks) {
      expect(block.x).toBeGreaterThanOrEqual(0);
      expect(block.y).toBeGreaterThanOrEqual(0);
      expect(block.x + block.width).toBeLessThanOrEqual(MARK_VIEWBOX);
      expect(block.y + block.height).toBeLessThanOrEqual(MARK_VIEWBOX);
    }
  });

  it.each([
    ['standard', MARK],
    ['compact', MARK_COMPACT],
  ] as const)('%s has exactly one block that beats', (_name, blocks) => {
    expect(blocks.filter((block) => block.role === 'accent')).toHaveLength(1);
  });

  it.each([
    ['standard', MARK],
    ['compact', MARK_COMPACT],
  ] as const)('%s keeps the beating block square', (_name, blocks) => {
    // Every other block is a rectangle: the square is what the eye picks out first.
    const accent = blocks.find((block) => block.role === 'accent')!;
    expect(accent.width).toBe(accent.height);
  });

  it('makes the beating block the largest of the standard drawing', () => {
    // Only the standard drawing. The compact one trades a column of blocks for one tall
    // slab, which is deliberately heavier so the mark survives at 16 px.
    const area = (block: (typeof MARK)[number]) => block.width * block.height;
    const accent = MARK.find((block) => block.role === 'accent')!;
    const largestInk = Math.max(...MARK.filter((block) => block.role === 'ink').map(area));
    expect(area(accent)).toBeGreaterThan(largestInk);
  });

  it('lets the accent block step above the safe margin — that is the pulse', () => {
    const accent = MARK.find((block) => block.role === 'accent')!;
    expect(accent.y).toBeLessThan(MARK_SAFE_MARGIN);
  });

  it('draws the compact mark with fewer, heavier blocks', () => {
    expect(MARK_COMPACT.length).toBeLessThan(MARK.length);
  });
});

describe('no colour is written by hand', () => {
  it('paints the svg files with token values only', () => {
    const allowed = new Set(Object.values(HEX));
    for (const asset of SVG_ASSETS) {
      for (const [, colour] of asset.contents.matchAll(/fill="(#[0-9a-f]{6})"/g)) {
        expect(allowed, `${relative(asset.path)} paints ${colour}`).toContain(colour);
      }
    }
  });
});
