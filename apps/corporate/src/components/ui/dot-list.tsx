import { Dot } from './dot';
import { cn } from '@/lib/utils';

/** A bulleted list, where the bullet is the motif. */
export function DotList({ items, className }: { items: readonly string[]; className?: string }) {
  return (
    <ul className={cn('flex flex-col gap-2', className)}>
      {items.map((item) => (
        <li key={item} className="text-ink-muted text-body flex items-baseline gap-3">
          <Dot className="translate-y-[-0.15em]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
