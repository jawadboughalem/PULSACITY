import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { SectionBand } from '@/components/sections/section-band';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { SectionTitle } from '@/components/ui/section-title';
import { StepList } from '@/components/ui/step-list';
import { TextLink } from '@/components/ui/text-link';
import { liveLines } from '@/lib/lines';

export const metadata: Metadata = {
  title: 'Merci',
  robots: { index: false, follow: false },
};

/** Where Stripe sends a customer whose payment went through. */
export default function MerciPage() {
  const line = liveLines()[0];
  if (!line?.journey) notFound();
  const { paid } = line.journey;

  return (
    <>
      <SiteHeader />
      <main>
        <SectionBand tone="ground" divided={false} width="narrow">
          <div className="flex flex-col gap-6">
            <SectionTitle as="h1" className="text-display">
              {paid.title}
            </SectionTitle>
            <p className="text-lead text-ink-muted">{paid.text}</p>
          </div>

          <StepList className="mt-title" steps={paid.steps.map((step) => ({ title: step }))} />

          <TextLink href="/" className="text-body-sm mt-title">
            ← Retour à l’accueil
          </TextLink>
        </SectionBand>
      </main>
      <SiteFooter />
    </>
  );
}
