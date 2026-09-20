import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { RenderSections } from '@/components/sections/render-section';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { findLine, liveLines } from '@/lib/lines';

/** One page per live line, built at compile time from the content files. */
export function generateStaticParams() {
  return liveLines().map((line) => ({ slug: line.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const line = findLine((await params).slug);
  if (!line || line.status !== 'live') return {};
  return {
    title: line.title,
    description: line.tagline,
    alternates: { canonical: `/${line.slug}` },
  };
}

export default async function LinePage({ params }: { params: Promise<{ slug: string }> }) {
  const line = findLine((await params).slug);
  if (!line || line.status !== 'live') notFound();

  return (
    <>
      <SiteHeader />
      <main>
        <RenderSections sections={line.sections} />
      </main>
      <SiteFooter />
    </>
  );
}
