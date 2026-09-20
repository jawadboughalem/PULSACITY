import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import type { Section } from '@/lib/lines';

import { SectionShell } from './section-shell';

type Cta = Extract<Section, { type: 'cta' }>;

export function CtaSection({ section }: { section: Cta }) {
  return (
    <SectionShell width="narrow">
      <div className="reveal text-center">
        <p className="text-title text-ink font-semibold">{section.title}</p>
        <p className="text-ink-muted mt-3">{section.text}</p>
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
