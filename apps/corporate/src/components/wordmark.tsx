import { LogoMark } from '@/components/logo-mark';
import { cn } from '@/lib/utils';

/**
 * The brand in letters.
 *
 * Alone, it keeps the pulsing dot — that dot is the brand's punctuation. Beside the
 * mark it drops it, because the mark already carries the pulse and two corals side by
 * side is a stammer.
 */
export function Wordmark({ withDot = true, className }: { withDot?: boolean; className?: string }) {
  return (
    <span className={cn('text-ink font-semibold tracking-[0.2em]', className)}>
      PULSACITY
      {withDot ? (
        <span aria-hidden="true" className="wordmark-dot text-accent ml-0.5 inline-block">
          .
        </span>
      ) : null}
    </span>
  );
}

/** The mark and the name together — the lockup, used wherever the brand signs itself. */
export function Logo({
  reversed = false,
  className,
  markClassName,
  wordmarkClassName,
}: {
  reversed?: boolean;
  className?: string;
  markClassName?: string;
  wordmarkClassName?: string;
}) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark reversed={reversed} className={cn('size-7', markClassName)} />
      <Wordmark
        withDot={false}
        className={cn('text-base', reversed && 'text-ground', wordmarkClassName)}
      />
    </span>
  );
}
