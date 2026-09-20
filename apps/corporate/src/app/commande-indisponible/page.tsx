import type { Metadata } from 'next';
import Link from 'next/link';

import { loadSite } from '@/lib/site-content';

export const metadata: Metadata = {
  title: 'Commande indisponible',
  robots: { index: false, follow: false },
};

/** Shown when the payment link cannot be created. */
export default function CommandeIndisponiblePage() {
  const site = loadSite();

  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-lg flex-col justify-center px-4 py-20">
      <h1 className="text-ink text-2xl font-semibold tracking-tight">
        La commande est momentanément indisponible.
      </h1>
      <p className="text-ink-muted mt-3">
        Rien n&apos;a été débité. Réessayez dans quelques instants.
      </p>
      {site.contact.email ? (
        <p className="text-ink-muted mt-3">
          Vous pouvez aussi nous écrire à{' '}
          <a
            href={`mailto:${site.contact.email}`}
            className="text-accent-ink underline underline-offset-4"
          >
            {site.contact.email}
          </a>
          .
        </p>
      ) : null}
      <Link href="/" className="text-accent mt-6 underline underline-offset-2">
        ← Retour à l&apos;accueil
      </Link>
    </main>
  );
}
