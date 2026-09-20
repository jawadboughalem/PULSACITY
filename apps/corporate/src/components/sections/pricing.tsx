import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { SectionTitle } from '@/components/ui/section-title';
import { Surface } from '@/components/ui/surface';
import type { Section } from '@/lib/lines';

type Pricing = Extract<Section, { type: 'pricing' }>;

/**
 * The band stays paper; the price is a sunken inset laid on it. One per page —
 * a second would stop meaning "this is the number that matters".
 */
export function PricingSection({ section }: { section: Pricing }) {
  return (
    <div className="gap-title flex flex-col">
      <SectionTitle>{section.title}</SectionTitle>
      <Surface
        as="div"
        tone="sunken"
        className="border-line max-w-narrow flex flex-col gap-6 rounded-lg border p-8 sm:p-10"
      >
        <p className="font-display text-figure text-ink">{section.headline}</p>
        <p className="text-ink-muted text-body">{section.text}</p>
        <div>
          <Link href={section.action.href} className={buttonVariants({ size: 'lg' })}>
            {section.action.label}
          </Link>
        </div>
      </Surface>
    </div>
  );
}
