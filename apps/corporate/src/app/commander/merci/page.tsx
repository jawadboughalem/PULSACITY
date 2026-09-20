import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { z } from 'zod';

import { OrderForm } from '@/components/order-form';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
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
  if (!line?.offer) notFound();

  const site = loadSite();
  // Anything that is not a well-formed id is simply ignored.
  const leadId = z
    .string()
    .uuid()
    .safeParse((await searchParams).lead).data;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl px-4 py-20 sm:py-28">
        <h1 className="text-title text-ink font-semibold">Merci.</h1>
        <p className="text-lead text-ink-muted mt-4">Je vous appelle {site.callbackDelay}.</p>
        <p className="text-ink-muted mt-3">
          On cale ensemble les pages, le ton et les photos. Vous verrez votre site sur votre
          téléphone avant de régler quoi que ce soit.
        </p>

        <div className="border-line bg-surface mt-12 rounded-lg border p-6">
          <p className="text-ink font-medium">Vous préférez régler dès maintenant ?</p>
          <p className="text-ink-muted mt-1 text-sm">
            Ce n&apos;est pas nécessaire : vous pouvez attendre de voir votre site.
          </p>
          <OrderForm
            offer={line.slug}
            source="page"
            {...(leadId ? { leadId } : {})}
            label={`Régler maintenant — ${formatEurHt(line.offer.priceHtCents)}`}
            variant="secondary"
            className="mt-5"
          />
        </div>

        <Link
          href="/"
          className="text-accent-ink mt-10 inline-block text-sm underline underline-offset-4"
        >
          ← Retour à l&apos;accueil
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}
