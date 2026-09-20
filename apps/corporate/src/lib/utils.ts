import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * The type scale, as `text-*` suffixes.
 *
 * tailwind-merge only knows Tailwind's own scales. Left to itself it reads
 * `text-title` as a *colour*, so `cn('text-title', 'text-ink')` drops the size
 * and keeps the colour — silently, with no build error. Declaring the scale here
 * puts each name back in the font-size group. `utils.test.ts` checks this list
 * against the `--text-*` tokens, so a level added to the palette cannot be
 * forgotten here.
 */
export const TEXT_SCALE = [
  'display',
  'figure',
  'title',
  'subtitle',
  'lead',
  'body',
  'body-sm',
  'caption',
  'eyebrow',
] as const;

/** Named container widths, as `max-w-*` suffixes. */
export const CONTAINER_SCALE = ['measure', 'narrow', 'wide'] as const;

/** Named rhythm, as padding / margin / gap suffixes. */
export const SPACING_SCALE = [
  'dot-sm',
  'dot-md',
  'gutter',
  'section',
  'section-tight',
  'title',
] as const;

const SPACING_GROUPS = ['p', 'px', 'py', 'pt', 'pb', 'm', 'mx', 'my', 'mt', 'mb', 'gap'] as const;

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: [...TEXT_SCALE] }],
      'max-w': [{ 'max-w': [...CONTAINER_SCALE] }],
      ...Object.fromEntries(
        SPACING_GROUPS.map((group) => [group, [{ [group]: [...SPACING_SCALE] }]]),
      ),
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** URL-safe slug: lowercase, accents folded, non-alphanumerics collapsed to dashes. */
export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}
