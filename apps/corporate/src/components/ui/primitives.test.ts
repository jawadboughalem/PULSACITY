/**
 * The two rules the primitives encode that survive without a DOM: how a section
 * title takes its coral stop, and how a button's variant and size combine once
 * `cn` has reconciled them.
 */
import { describe, expect, it } from 'vitest';

import { buttonVariants } from './button';
import { titleParts } from './section-title';
import { cn } from '@/lib/utils';

describe('titleParts', () => {
  it('gives a bare title a stop', () => {
    expect(titleParts('Comment ça se passe')).toEqual({ body: 'Comment ça se passe', stop: true });
  });

  it('recolours a stop the content already wrote', () => {
    expect(titleParts('Votre site, fait pour vous.')).toEqual({
      body: 'Votre site, fait pour vous',
      stop: true,
    });
  });

  it('leaves any other closing punctuation alone', () => {
    for (const title of ['Et après la première année ?', 'Une chose !', 'Trois points…']) {
      expect(titleParts(title)).toEqual({ body: title, stop: false });
    }
  });

  it('draws nothing when the section already spends its dot on an eyebrow', () => {
    expect(titleParts('Comment ça se passe', true)).toEqual({
      body: 'Comment ça se passe',
      stop: false,
    });
  });
});

describe('buttonVariants', () => {
  it.each(['sm', 'default', 'lg'] as const)('gives the %s size a real height', (size) => {
    expect(cn(buttonVariants({ size }))).toMatch(/\bh-1[013]\b/);
  });

  it('drops the box on the link variant, whatever the size', () => {
    // cva emits `size` after `variant`, so without a compound variant the size's
    // height and padding win and the link renders as a box.
    for (const size of ['sm', 'default', 'lg'] as const) {
      const classes = cn(buttonVariants({ variant: 'link', size }));
      expect(classes).toContain('h-auto');
      expect(classes).not.toMatch(/\bh-1[013]\b/);
      expect(classes).not.toMatch(/\bpx-[456]\b/);
    }
  });

  it('keeps the type size on a link', () => {
    expect(cn(buttonVariants({ variant: 'link', size: 'lg' }))).toContain('text-body');
  });
});
