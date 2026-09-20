import * as React from 'react';

import { cn } from '@/lib/utils';

const WIDTHS = {
  /** Long-form reading: legal pages, a FAQ answer. About 68 characters. */
  measure: 'max-w-measure',
  /** Forms, the price block, a section of text alone. */
  narrow: 'max-w-narrow',
  /** The page. */
  wide: 'max-w-wide',
} as const;

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: keyof typeof WIDTHS;
}

/** Centres content and holds the side gutter. The only place a width is chosen. */
export function Container({ width = 'wide', className, ...props }: ContainerProps) {
  return <div className={cn('px-gutter mx-auto w-full', WIDTHS[width], className)} {...props} />;
}
