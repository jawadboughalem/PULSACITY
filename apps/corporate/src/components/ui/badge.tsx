import { cn } from '@/lib/utils';

/**
 * A short status word — « En préparation ». Reads on paper and on ink alike:
 * both tokens are redeclared inside an inverted surface.
 */
export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'bg-accent-soft text-accent-ink text-eyebrow rounded-md px-2 py-1 font-semibold uppercase',
        className,
      )}
    >
      {children}
    </span>
  );
}
