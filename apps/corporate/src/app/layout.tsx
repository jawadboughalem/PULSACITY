import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
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
    <html lang="fr" className={manrope.variable}>
      <body>
        {children}
        {/* Audience measurement without cookies — hence no consent banner. */}
        <Analytics />
      </body>
    </html>
  );
}
