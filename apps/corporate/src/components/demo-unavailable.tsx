import { corporateOrigin, CORPORATE_HOST } from '@/lib/env';

/** Shown when a demo is unknown, expired, or already sold. */
export function DemoUnavailable() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-lg flex-col justify-center px-4 py-20">
      <p className="text-sm font-medium tracking-[0.18em] text-neutral-500">PULSACITY</p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900">
        Cette démo n&apos;est plus disponible.
      </h1>
      <p className="mt-3 text-neutral-600">
        Le lien a peut-être expiré. Nous pouvons préparer à nouveau votre site.
      </p>
      <a href={corporateOrigin()} className="text-accent mt-6 underline underline-offset-2">
        Aller sur {CORPORATE_HOST}
      </a>
    </main>
  );
}
