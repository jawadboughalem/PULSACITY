import { cn } from '@/lib/utils';

/**
 * The hairline.
 *
 * It separates two bands that share a surface, and nothing else — where the
 * surface changes, the change is already the separation, and a line on top of it
 * does the same job twice.
 */
export function Divider({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn('bg-line h-px w-full', className)} />;
}
