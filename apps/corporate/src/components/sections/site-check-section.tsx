import { SiteCheck } from '@/components/site-check';

export function SiteCheckSection() {
  return (
    <section id="mon-site" className="bg-accent-soft/50 border-t border-neutral-200">
      <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:py-20">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
          Votre site est peut-être déjà prêt
        </h2>
        <p className="mt-3 text-neutral-600">
          Nous préparons les sites avant d&apos;appeler. Cherchez le nom de votre entreprise : si le
          vôtre existe déjà, vous le verrez tout de suite.
        </p>

        <div className="mt-8">
          <SiteCheck />
        </div>
      </div>
    </section>
  );
}
