import type { Metadata } from 'next';
import { Fraunces, Manrope } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';

import { corporateOrigin } from '@/lib/env';
import { liveLines } from '@/lib/lines';
import { loadSite } from '@/lib/site-content';

import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
});

/*
 * The display face. `opsz` thickens the drawing as the size drops, which is what
 * keeps a serif crisp on a low-end phone; `SOFT` rounds the terminals. `WONK` is
 * left at its default, so the axis is never downloaded.
 */
const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
  axes: ['SOFT', 'opsz'],
});

/** Title and description come from the content, like everything else on the page. */
export function generateMetadata(): Metadata {
  const site = loadSite();
  const line = liveLines()[0];
  const hero = line?.sections.find((section) => section.type === 'hero');
  const title = hero ? `${site.brand} — ${hero.title}` : site.brand;
  const description = hero?.text ?? line?.tagline ?? '';

  return {
    metadataBase: new URL(corporateOrigin()),
    title: { default: title, template: `%s — ${site.brand}` },
    description,
    openGraph: {
      type: 'website',
      locale: 'fr_FR',
      siteName: site.brand,
      title,
      description,
      url: '/',
    },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical: '/' },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${manrope.variable} ${fraunces.variable}`}>
      <body>
        {children}
        {/* Audience measurement without cookies — hence no consent banner. */}
        <Analytics />
      </body>
    </html>
  );
}
