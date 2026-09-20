import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { BriefForm } from '@/components/brief-form';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { liveLines } from '@/lib/lines';
import { loadSite } from '@/lib/site-content';

export const metadata: Metadata = {
  title: 'Demander mon site',
  description: 'Décrivez votre activité et le site que vous voulez.',
  alternates: { canonical: '/commander' },
};

export default function CommanderPage() {
  const line = liveLines()[0];
  if (!line) notFound();
  const site = loadSite();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-4 py-16 sm:py-24">
        <h1 className="text-title text-ink font-semibold">Demander mon site</h1>
        <p className="text-lead text-ink-muted mt-4">
          Trois minutes suffisent. Je vous appelle {site.callbackDelay} pour caler les pages, le ton
          et les photos.
        </p>

        <div className="mt-12">
          <BriefForm lineSlug={line.slug} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
