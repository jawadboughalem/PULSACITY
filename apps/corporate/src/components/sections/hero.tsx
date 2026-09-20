import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { SectionTitle } from '@/components/ui/section-title';
import type { Section } from '@/lib/lines';

type Hero = Extract<Section, { type: 'hero' }>;

/** The only `h1`, and the only place the display size is used. */
export function HeroSection({ section }: { section: Hero }) {
  return (
    <div className="flex flex-col gap-8">
      <SectionTitle as="h1" className="text-display max-w-[16ch]">
        {section.title}
      </SectionTitle>
      <p className="text-lead text-ink-muted max-w-narrow">{section.text}</p>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
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
    </div>
  );
}
