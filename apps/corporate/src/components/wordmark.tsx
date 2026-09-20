import { cn } from '@/lib/utils';

/** The brand, with the pulse it is named after. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn('text-ink font-semibold tracking-[0.2em]', className)}>
      PULSACITY
      <span aria-hidden="true" className="wordmark-dot text-accent ml-0.5 inline-block">
        .
      </span>
    </span>
  );
}
