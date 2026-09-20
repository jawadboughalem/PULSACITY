import Link from 'next/link';

import { Wordmark } from '@/components/wordmark';
import { buttonVariants } from '@/components/ui/button';
import { liveLines } from '@/lib/lines';

/** Nothing here is written by hand: the links are the live lines, the call is theirs. */
export function SiteHeader() {
  const lines = liveLines();
  const firstHero = lines[0]?.sections.find((section) => section.type === 'hero');

  return (
    <header className="border-line bg-ground/90 sticky top-0 z-50 border-b backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-4 px-4">
        <Link href="/" aria-label="PULSACITY, accueil">
          <Wordmark className="text-base" />
        </Link>

        {lines.length > 1 ? (
          <nav aria-label="Nos offres" className="hidden items-center gap-6 md:flex">
            {lines.map((line) => (
              <Link
                key={line.slug}
                href={`/${line.slug}`}
                className="text-ink-muted hover:text-ink text-sm"
              >
                {line.title}
              </Link>
            ))}
          </nav>
        ) : null}

        {firstHero ? (
          <Link href={firstHero.primary.href} className={buttonVariants({ size: 'sm' })}>
            {firstHero.primary.label}
          </Link>
        ) : null}
      </div>
    </header>
  );
}
