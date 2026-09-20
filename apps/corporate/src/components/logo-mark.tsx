import { MARK, MARK_COMPACT, MARK_VIEWBOX } from '@pulsacity/design/logo';

import { cn } from '@/lib/utils';

/**
 * The mark: unequal blocks, and the one that beats. The geometry comes from
 * `packages/design`, the colours from the tokens — nothing here decides either.
 *
 * Decorative on its own: the brand is always named in text beside it, so it is hidden
 * from assistive technology rather than read out twice.
 */
export function LogoMark({
  compact = false,
  reversed = false,
  className,
}: {
  /** The three-block drawing, for anything rendered below 24 px. */
  compact?: boolean;
  /** On an inked surface, the plain blocks are cut out of the ground instead. */
  reversed?: boolean;
  className?: string;
}) {
  const blocks = compact ? MARK_COMPACT : MARK;

  return (
    <svg
      viewBox={`0 0 ${MARK_VIEWBOX} ${MARK_VIEWBOX}`}
      aria-hidden="true"
      focusable="false"
      className={cn('size-8 shrink-0', className)}
    >
      {blocks.map((block) => (
        <rect
          key={`${block.x}-${block.y}`}
          x={block.x}
          y={block.y}
          width={block.width}
          height={block.height}
          rx={block.radius}
          className={
            block.role === 'accent' ? 'fill-accent' : reversed ? 'fill-ground' : 'fill-ink'
          }
        />
      ))}
    </svg>
  );
}
