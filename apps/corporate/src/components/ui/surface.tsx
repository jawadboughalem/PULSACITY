import * as React from 'react';

import { cn } from '@/lib/utils';

const TONES = {
  /** The paper. The default, and where the document starts and ends. */
  ground: 'bg-ground',
  /** A card laid on the paper. Never full width — that is what `Card` is for. */
  raised: 'bg-surface',
  /** The sunken inset. One per page: the price. */
  sunken: 'bg-surface-sunken',
  /**
   * The inked block. At most two per page, never adjacent, never at the top or
   * bottom edge. The class redeclares the ink tokens, so anything inside is
   * written exactly as it would be on paper.
   */
  inverted: 'surface-inverted',
} as const;

export interface SurfaceProps extends React.HTMLAttributes<HTMLElement> {
  tone?: keyof typeof TONES;
  as?: 'section' | 'div' | 'footer' | 'header';
}

/**
 * A band of the page, and the colour it sits on.
 *
 * Changing tone *is* the separation: a `Divider` only belongs between two bands
 * that share a tone.
 */
export function Surface({ tone = 'ground', as = 'section', className, ...props }: SurfaceProps) {
  const Tag = as;
  return <Tag className={cn(TONES[tone], className)} {...props} />;
}
