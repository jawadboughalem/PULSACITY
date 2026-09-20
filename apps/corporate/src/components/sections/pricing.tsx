import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import type { Section } from '@/lib/lines';

import { SectionShell } from './section-shell';

type Pricing = Extract<Section, { type: 'pricing' }>;

export function PricingSection({ section }: { section: Pricing }) {
  return (
    <SectionShell id="prix" title={section.title} width="narrow" tinted>
      <div className="reveal border-accent bg-surface rounded-lg border p-8 sm:p-10">
        <p className="text-title text-ink font-semibold">{section.headline}</p>
        <p className="text-ink-muted mt-4">{section.text}</p>
        <Link
          href={section.action.href}
          className={buttonVariants({ size: 'lg', className: 'mt-8' })}
        >
          {section.action.label}
        </Link>
      </div>
    </SectionShell>
  );
}
