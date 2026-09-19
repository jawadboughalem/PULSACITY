import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Merci',
  robots: { index: false, follow: false },
};

const NEXT_STEPS = [
  'Nous réservons votre nom de domaine en .fr, à votre nom.',
  'Nous vous appelons : 10 minutes pour relever vos corrections.',
  'Votre site est mis en ligne sous 72 h.',
  'Votre facture vous est envoyée par Stripe.',
];

export default function MerciPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col px-4 py-20">
      <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
        Votre paiement est bien reçu.
      </h1>
      <p className="mt-4 text-neutral-600">Merci. Voici ce qui se passe maintenant.</p>

      <ol className="mt-8 space-y-4">
        {NEXT_STEPS.map((step, index) => (
          <li key={step} className="flex gap-3">
            <span className="bg-accent-soft text-accent flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
              {index + 1}
            </span>
            <span className="text-neutral-700">{step}</span>
          </li>
        ))}
      </ol>

      <Link href="/" className="text-accent mt-10 text-sm underline underline-offset-2">
        ← Retour à l&apos;accueil
      </Link>
    </main>
  );
}
