import { Logo } from '@/components/wordmark';
import { CORPORATE_HOST, corporateOrigin } from '@/lib/env';

/** Shown when a demo is unknown, expired, or already sold. */
export function DemoUnavailable() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-lg flex-col justify-center px-4 py-20">
      <Logo markClassName="size-6" wordmarkClassName="text-sm" />
      <h1 className="text-title text-ink mt-4 font-semibold">
        Cette démo n&apos;est plus disponible.
      </h1>
      <p className="text-ink-muted mt-3">
        Le lien a peut-être expiré. Je peux préparer à nouveau votre site.
      </p>
      <a href={corporateOrigin()} className="text-accent-ink mt-6 underline underline-offset-4">
        Aller sur {CORPORATE_HOST}
      </a>
    </main>
  );
}
