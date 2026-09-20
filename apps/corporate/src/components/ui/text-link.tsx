import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/lib/utils';

export interface TextLinkProps {
  href: string;
  children: React.ReactNode;
  /** Opens a new tab, shows the mark, and says so to a screen reader. */
  external?: boolean;
  className?: string;
}

/**
 * An inline link. `accent-ink` is the readable coral — 8.70:1 on paper, 6.59:1
 * on ink — and the underline carries the meaning where colour alone would not.
 */
export function TextLink({ href, children, external = false, className }: TextLinkProps) {
  const classes = cn(
    'text-accent-ink hover:text-accent inline-flex items-center gap-1 underline underline-offset-4',
    'duration-[var(--duration-fast)] ease-out transition-colors',
    className,
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer noopener" className={classes}>
        {children}
        <ArrowUpRight aria-hidden="true" className="size-4 shrink-0" />
        <span className="sr-only">(nouvelle fenêtre)</span>
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
