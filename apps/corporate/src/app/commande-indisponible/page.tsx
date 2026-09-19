import type { Metadata } from 'next';
import Link from 'next/link';

import { contactDetails } from '@/lib/server-env';

export const metadata: Metadata = {
  title: 'Commande indisponible',
  robots: { index: false, follow: false },
};

/** Shown when the payment link cannot be created. */
export default function CommandeIndisponiblePage() {
  const contact = contactDetails();

  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-lg flex-col justify-center px-4 py-20">
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
        La commande est momentanément indisponible.
      </h1>
      <p className="mt-3 text-neutral-600">
        Rien n&apos;a été débité. Réessayez dans quelques instants.
      </p>
      {contact.email ? (
        <p className="mt-3 text-neutral-600">
          Vous pouvez aussi nous écrire à{' '}
          <a href={`mailto:${contact.email}`} className="text-accent underline underline-offset-2">
            {contact.email}
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
