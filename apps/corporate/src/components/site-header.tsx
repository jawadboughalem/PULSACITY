import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';

const NAV = [
  { href: '#inclus', label: 'Ce qui est inclus' },
  { href: '#methode', label: 'Comment ça marche' },
  { href: '#prix', label: 'Prix' },
  { href: '#faq', label: 'Questions' },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-4 px-4">
        <Link href="/" className="text-lg font-semibold tracking-[0.18em] text-neutral-900">
          PULSACITY
        </Link>

        <nav aria-label="Sections de la page" className="hidden items-center gap-6 md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-neutral-600 hover:text-neutral-900"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a href="#mon-site" className={buttonVariants({ size: 'sm' })}>
          Voir si mon site est déjà prêt
        </a>
      </div>
    </header>
  );
}
