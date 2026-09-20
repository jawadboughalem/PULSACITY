import Link from 'next/link';

import { Wordmark } from '@/components/wordmark';

/** Sober 404: unknown host, unknown page. */
export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-lg flex-col justify-center px-4 py-20">
      <Wordmark className="text-sm" />
      <h1 className="text-title text-ink mt-4 font-semibold">Cette page n&apos;existe pas.</h1>
      <p className="text-ink-muted mt-3">
        Le lien est peut-être incomplet ou la page a été retirée.
      </p>
      <Link href="/" className="text-accent-ink mt-6 underline underline-offset-4">
        Aller sur pulsacity.com
      </Link>
    </main>
  );
}
