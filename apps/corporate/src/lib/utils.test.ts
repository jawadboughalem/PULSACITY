/**
 * `cn` is the only place a class list is reconciled, so a scale it does not know
 * about is a whole family of invisible bugs: the class is dropped, nothing warns,
 * and the component renders at the wrong size.
 */
import { readTokens } from '@pulsacity/design/tokens';
import { describe, expect, it } from 'vitest';

import { cn, CONTAINER_SCALE, slugify, SPACING_SCALE, TEXT_SCALE } from './utils';

const tokens = readTokens();

const suffixes = (prefix: string) =>
  Object.keys(tokens.base)
    .filter((name) => name.startsWith(prefix) && !name.slice(prefix.length).includes('--'))
    .map((name) => name.slice(prefix.length))
    .sort();

describe('the scales cn knows match the tokens', () => {
  it('covers every --text-* level', () => {
    expect([...TEXT_SCALE].sort()).toEqual(suffixes('--text-'));
  });

  it('covers every --container-* width', () => {
    expect([...CONTAINER_SCALE].sort()).toEqual(suffixes('--container-'));
  });

  it('covers every named --spacing-* step', () => {
    // `--spacing` itself is the base unit, not a named step.
    expect([...SPACING_SCALE].sort()).toEqual(suffixes('--spacing-'));
  });
});

describe('cn keeps a size next to a colour', () => {
  it.each(TEXT_SCALE)('keeps text-%s alongside text-ink', (level) => {
    expect(cn(`text-${level}`, 'text-ink')).toBe(`text-${level} text-ink`);
  });

  it('keeps the size when the colour comes first', () => {
    expect(cn('text-ink-muted', 'text-lead')).toBe('text-ink-muted text-lead');
  });

  it('still collapses two colours', () => {
    expect(cn('text-ink', 'text-ink-muted')).toBe('text-ink-muted');
  });

  it('still collapses two sizes', () => {
    expect(cn('text-title', 'text-display')).toBe('text-display');
  });

  it('leaves Tailwind’s own scale alone', () => {
    expect(cn('text-sm', 'text-ink')).toBe('text-sm text-ink');
    expect(cn('text-sm', 'text-base')).toBe('text-base');
  });
});

describe('cn collapses the named widths and rhythm', () => {
  it('keeps the last container width', () => {
    expect(cn('max-w-narrow', 'max-w-wide')).toBe('max-w-wide');
  });

  it('keeps the last value on the same axis', () => {
    expect(cn('py-section', 'py-section-tight')).toBe('py-section-tight');
  });

  it('leaves distinct axes alone', () => {
    expect(cn('py-section', 'px-gutter')).toBe('py-section px-gutter');
  });
});

describe('slugify', () => {
  it('folds accents and collapses separators', () => {
    expect(slugify('Créateur de sites — Été 2026')).toBe('createur-de-sites-ete-2026');
  });

  it('trims the dashes it would otherwise leave at the edges', () => {
    expect(slugify('  ... Bonjour ...  ')).toBe('bonjour');
  });
});
