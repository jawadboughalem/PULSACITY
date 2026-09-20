import { Dot } from './dot';
import { cn } from '@/lib/utils';

/**
 * The kicker above a section title. Carries the dot, so a section that has an
 * eyebrow does not also take a coral full stop — one mark per eyeful.
 */
export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        'text-eyebrow text-ink-muted flex items-center gap-2.5 font-semibold uppercase',
        className,
      )}
    >
      <Dot />
      <span>{children}</span>
    </p>
  );
}
