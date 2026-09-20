import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { z } from 'zod';

import { OrderForm } from '@/components/order-form';
import { SectionBand } from '@/components/sections/section-band';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { SectionTitle } from '@/components/ui/section-title';
import { Surface } from '@/components/ui/surface';
import { TextLink } from '@/components/ui/text-link';
import { liveLines } from '@/lib/lines';
import { formatEurHt } from '@/lib/pricing';
import { loadSite } from '@/lib/site-content';

export const metadata: Metadata = {
  title: 'Demande envoyée',
  robots: { index: false, follow: false },
};

export default async function BriefSentPage({
  searchParams,
}: {
  searchParams: Promise<{ lead?: string }>;
}) {
  const line = liveLines()[0];
  if (!line?.offer || !line.journey) notFound();

  const site = loadSite();
  // Anything that is not a well-formed id is simply ignored.
  const leadId = z
    .string()
    .uuid()
    .safeParse((await searchParams).lead).data;
  const { sent } = line.journey;

  return (
    <>
      <SiteHeader />
      <main>
        <SectionBand tone="ground" divided={false} width="narrow">
          <div className="flex flex-col gap-6">
            <SectionTitle as="h1" className="text-display">
              {sent.title}
            </SectionTitle>
            <p className="text-lead text-ink-muted">Je vous appelle {site.callbackDelay}.</p>
            <p className="text-ink-muted text-body">{sent.text}</p>
          </div>

          <Surface
            as="div"
            tone="sunken"
            className="border-line mt-title flex flex-col gap-2 rounded-lg border p-6 sm:p-8"
          >
            <p className="text-subtitle text-ink font-semibold">{sent.payNowTitle}</p>
            <p className="text-ink-muted text-body-sm">{sent.payNowText}</p>
            <OrderForm
              offer={line.slug}
              source="page"
              {...(leadId ? { leadId } : {})}
              label={`Régler maintenant — ${formatEurHt(line.offer.priceHtCents)}`}
              variant="secondary"
              className="mt-4"
            />
          </Surface>

          <TextLink href="/" className="text-body-sm mt-title">
            ← Retour à l’accueil
          </TextLink>
        </SectionBand>
      </main>
      <SiteFooter />
    </>
  );
}
