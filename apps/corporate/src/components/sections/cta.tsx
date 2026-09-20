import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { SectionTitle } from '@/components/ui/section-title';
import type { Section } from '@/lib/lines';

type Cta = Extract<Section, { type: 'cta' }>;

/** The way out, on ink. The second and last inked block of the page. */
export function CtaSection({ section }: { section: Cta }) {
  return (
    <div className="flex flex-col gap-6">
      <SectionTitle className="text-display max-w-[18ch]">{section.title}</SectionTitle>
      <p className="text-lead text-ink-muted max-w-narrow">{section.text}</p>
      <div className="mt-2">
        <Link href={section.action.href} className={buttonVariants({ size: 'lg' })}>
          {section.action.label}
        </Link>
      </div>
    </div>
  );
}
