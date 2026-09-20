import { cn } from '@/lib/utils';

/**
 * The brand, with the pulse it is named after.
 *
 * The dot is a drawn span, not a typed full stop: a « . » from the font changes
 * size with the weight and sits where the font decides, so it cannot be set.
 * Expressed in `em`, it follows the wordmark at any size.
 *
 * `animated` is opt-in and belongs to the header alone — two pulses on one
 * screen and the motif is a tic rather than a signature.
 */
export function Wordmark({
  className,
  animated = false,
}: {
  className?: string;
  animated?: boolean;
}) {
  return (
    <span
      className={cn(
        'text-ink inline-flex items-baseline font-semibold tracking-[0.2em]',
        className,
      )}
    >
      PULSACITY
      <span
        aria-hidden="true"
        className={cn(
          'bg-accent ml-[0.1em] inline-block size-[0.18em] rounded-full',
          animated && 'wordmark-dot',
        )}
      />
    </span>
  );
}
