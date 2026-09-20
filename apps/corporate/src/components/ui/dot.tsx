import { cn } from '@/lib/utils';

const SIZES = {
  /** A list bullet, or the mark before an eyebrow. */
  sm: 'size-dot-sm',
  /** A step marker on the thread. */
  md: 'size-dot-md',
} as const;

export interface DotProps {
  size?: keyof typeof SIZES;
  /** The slow pulse. One per page, in the header — never twice on one screen. */
  animated?: boolean;
  className?: string;
}

/**
 * The signature mark.
 *
 * Coral `accent` because it is drawn, not typed: a *glyph* in the accent colour
 * takes `accent-ink`, which is readable as text. One dot per eyeful — two in the
 * same block and the motif stops being a signature.
 */
export function Dot({ size = 'sm', animated = false, className }: DotProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'bg-accent inline-block shrink-0 rounded-full',
        SIZES[size],
        animated && 'wordmark-dot',
        className,
      )}
    />
  );
}
