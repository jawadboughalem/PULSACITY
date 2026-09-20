import { Plus } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface DisclosureProps {
  summary: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * A question that opens. Native `<details>`, so it works before hydration and
 * the keyboard gets it for free. The icon is one of the five permitted uses: it
 * says the row opens, which the text does not.
 */
export function Disclosure({ summary, children, className }: DisclosureProps) {
  return (
    <details className={cn('group py-5', className)}>
      <summary className="text-ink text-body flex cursor-pointer list-none items-start justify-between gap-6 font-medium marker:content-none">
        {summary}
        <Plus
          aria-hidden="true"
          className="text-ink-faint mt-1 size-5 shrink-0 transition-transform duration-[var(--duration-fast)] ease-out group-open:rotate-45"
        />
      </summary>
      <div className="text-ink-muted text-body mt-3 pr-10">{children}</div>
    </details>
  );
}
