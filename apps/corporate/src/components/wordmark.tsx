import { LogoMark } from '@/components/logo-mark';
import { cn } from '@/lib/utils';

/**
 * The brand in letters.
 *
 * Alone, it keeps the dot — that dot is the brand's punctuation. Beside the mark it
 * drops it, because the mark already carries the pulse and two corals side by side is
 * a stammer.
 *
 * The dot is a drawn span, not a typed full stop: a « . » from the font changes size
 * with the weight and sits where the font decides, so it cannot be set. Expressed in
 * `em`, it follows the wordmark at any size.
 */
export function Wordmark({ withDot = true, className }: { withDot?: boolean; className?: string }) {
  return (
    <span
      className={cn(
        'text-ink inline-flex items-baseline font-semibold tracking-[0.2em]',
        className,
      )}
    >
      PULSACITY
      {withDot ? (
        <span
          aria-hidden="true"
          className="bg-accent ml-[0.1em] inline-block size-[0.18em] rounded-full"
        />
      ) : null}
    </span>
  );
}

/**
 * The mark and the name together — the lockup, used wherever the brand signs itself.
 *
 * `animated` is opt-in and belongs to the header alone: one pulse per screen, or the
 * motif is a tic rather than a signature.
 */
export function Logo({
  reversed = false,
  animated = false,
  className,
  markClassName,
  wordmarkClassName,
}: {
  reversed?: boolean;
  animated?: boolean;
  className?: string;
  markClassName?: string;
  wordmarkClassName?: string;
}) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark reversed={reversed} animated={animated} className={cn('size-7', markClassName)} />
      <Wordmark withDot={false} className={cn('text-body-sm', wordmarkClassName)} />
    </span>
  );
}
