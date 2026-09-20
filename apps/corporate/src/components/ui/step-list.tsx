import { Dot } from './dot';
import { cn } from '@/lib/utils';

export interface Step {
  readonly title: string;
  /** Optional: a step can be a single sentence with nothing to add. */
  readonly text?: string;
}

/**
 * The method, as a thread.
 *
 * The number is gone on purpose: an ordered list already says where each step
 * falls, and the marker is the motif rather than a counter in a filled circle.
 * `<ol>` keeps that order available to a screen reader.
 */
export function StepList({ steps, className }: { steps: readonly Step[]; className?: string }) {
  return (
    <ol className={cn('relative flex flex-col gap-8 ps-8', className)}>
      <span aria-hidden="true" className="bg-line absolute bottom-2 left-[4px] top-2 w-px" />
      {steps.map((step) => (
        <li key={step.title} className="relative">
          <Dot size="md" className="ring-ground absolute left-[-32px] top-[0.4em] ring-4" />
          <h3 className="text-subtitle text-ink font-semibold">{step.title}</h3>
          {step.text ? <p className="text-ink-muted text-body mt-1">{step.text}</p> : null}
        </li>
      ))}
    </ol>
  );
}
