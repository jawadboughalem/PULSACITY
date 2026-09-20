import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import type { Section } from '@/lib/lines';

type Hero = Extract<Section, { type: 'hero' }>;

export function HeroSection({ section }: { section: Hero }) {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 pb-20 pt-20 sm:pb-28 sm:pt-32">
      <h1 className="text-display text-ink max-w-4xl font-semibold">{section.title}</h1>
      <p className="text-lead text-ink-muted mt-8 max-w-2xl">{section.text}</p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link href={section.primary.href} className={buttonVariants({ size: 'lg' })}>
          {section.primary.label}
        </Link>
        {section.secondary ? (
          <Link
            href={section.secondary.href}
            className={buttonVariants({ variant: 'secondary', size: 'lg' })}
          >
            {section.secondary.label}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
