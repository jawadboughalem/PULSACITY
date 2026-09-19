import Link from 'next/link';

/** Sober 404: unknown host, unknown page. */
export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-lg flex-col justify-center px-4 py-20">
      <p className="text-sm font-medium tracking-[0.18em] text-neutral-500">PULSACITY</p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900">
        Cette page n&apos;existe pas.
      </h1>
      <p className="mt-3 text-neutral-600">
        Le lien est peut-être incomplet ou la page a été retirée.
      </p>
      <Link href="/" className="text-accent mt-6 underline underline-offset-2">
        Aller sur pulsacity.com
      </Link>
    </main>
  );
}
