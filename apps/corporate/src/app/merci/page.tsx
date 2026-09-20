import type { Metadata } from 'next';
import Link from 'next/link';

import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

export const metadata: Metadata = {
  title: 'Merci',
  robots: { index: false, follow: false },
};

const NEXT_STEPS = [
  'Je réserve votre nom de domaine en .fr, à votre nom.',
  'Je vous appelle pour relever vos dernières corrections.',
  'Votre site est mis en ligne sous 72 h.',
  'Votre facture vous est envoyée par Stripe.',
];

export default function MerciPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-2xl flex-col px-4 py-20 sm:py-28">
        <h1 className="text-title text-ink font-semibold">Votre paiement est bien reçu.</h1>
        <p className="text-lead text-ink-muted mt-4">Merci. Voici ce qui se passe maintenant.</p>

        <ol className="mt-10 space-y-4">
          {NEXT_STEPS.map((step, index) => (
            <li key={step} className="flex gap-4">
              <span className="bg-accent-soft text-accent-ink flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
                {index + 1}
              </span>
              <span className="text-ink-muted">{step}</span>
            </li>
          ))}
        </ol>

        <Link href="/" className="text-accent-ink mt-12 text-sm underline underline-offset-4">
          ← Retour à l&apos;accueil
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}
