import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { BriefForm } from '@/components/brief-form';
import { SectionBand } from '@/components/sections/section-band';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { SectionTitle } from '@/components/ui/section-title';
import { liveLines } from '@/lib/lines';
import { loadSite } from '@/lib/site-content';

export const metadata: Metadata = {
  title: 'Demander mon site',
  description: 'Décrivez votre activité et le site que vous voulez.',
  alternates: { canonical: '/commander' },
};

export default function CommanderPage() {
  const line = liveLines()[0];
  if (!line?.journey) notFound();
  const site = loadSite();

  return (
    <>
      <SiteHeader />
      <main>
        <SectionBand tone="ground" divided={false} width="narrow">
          <div className="flex flex-col gap-6">
            <SectionTitle as="h1" className="text-display">
              {line.journey.brief.title}
            </SectionTitle>
            <p className="text-lead text-ink-muted">{line.journey.brief.text}</p>
            {/* The one sentence the page owns: the delay is brand-level, not offer copy. */}
            <p className="text-ink-muted text-body">Je vous appelle {site.callbackDelay}.</p>
          </div>

          <div className="mt-title">
            <BriefForm lineSlug={line.slug} />
          </div>
        </SectionBand>
      </main>
      <SiteFooter />
    </>
  );
}
