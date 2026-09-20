import type { Metadata } from 'next';

import { findLiveDemoBySlug, isDatabaseConfigured } from '@pulsacity/db';
import { renderSite, safeParseSiteContent } from '@pulsacity/templates';

import { DemoBanner } from '@/components/demo-banner';
import { DemoUnavailable } from '@/components/demo-unavailable';
import { demoTtlDays } from '@/lib/server-env';
import { liveLines } from '@/lib/lines';
import { formatEurHt } from '@/lib/pricing';

// A demo reflects the database at request time, and expires on its own.
export const dynamic = 'force-dynamic';

/** Demos are never indexed (CLAUDE.md rule 8). */
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export default async function DemoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!isDatabaseConfigured()) return <DemoUnavailable />;

  let site: Awaited<ReturnType<typeof findLiveDemoBySlug>> = null;
  try {
    site = await findLiveDemoBySlug(slug, demoTtlDays());
  } catch (error) {
    console.error(`Lecture de la démo « ${slug} » impossible.`, error);
    return <DemoUnavailable />;
  }
  if (!site) return <DemoUnavailable />;

  const content = safeParseSiteContent(site.content);
  if (!content.success) {
    console.error(`Contenu invalide pour la démo « ${slug} ».`, content.error.issues);
    return <DemoUnavailable />;
  }

  // A demo sells the first live line; its price comes from that line's content file.
  const line = liveLines()[0];
  if (!line?.offer) return <DemoUnavailable />;

  return (
    <>
      {/* Room for the fixed banner. */}
      <div className="pb-28">
        {renderSite({ name: site.name, city: site.city, content: content.data })}
      </div>
      <DemoBanner
        name={site.name}
        slug={site.slug}
        city={site.city}
        siteId={site.id}
        offerSlug={line.slug}
        priceLabel={formatEurHt(line.offer.priceHtCents)}
      />
    </>
  );
}
