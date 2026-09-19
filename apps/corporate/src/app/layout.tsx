import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';

import { corporateOrigin } from '@/lib/env';

import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const TITLE = 'PULSACITY — Le site de votre entreprise, déjà prêt.';
const DESCRIPTION =
  'Site vitrine complet, nom de domaine et hébergement inclus la première année. 500 € HT tout compris, en ligne sous 72 h.';

export const metadata: Metadata = {
  metadataBase: new URL(corporateOrigin()),
  title: { default: TITLE, template: '%s — PULSACITY' },
  description: DESCRIPTION,
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'PULSACITY',
    title: TITLE,
    description: DESCRIPTION,
    url: '/',
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
  alternates: { canonical: '/' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable}>
      <body>
        {children}
        {/* Audience measurement without cookies — hence no consent banner. */}
        <Analytics />
      </body>
    </html>
  );
}
