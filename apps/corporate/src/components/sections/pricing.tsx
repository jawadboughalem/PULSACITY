import { OrderForm } from '@/components/order-form';

export function Pricing() {
  return (
    <section id="prix" className="border-t border-neutral-200 bg-neutral-50/60">
      <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:py-20">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">Prix</h2>

        <div className="border-accent mt-8 rounded-2xl border bg-white p-8">
          <p className="text-3xl font-semibold text-neutral-900">500&nbsp;€ HT tout compris.</p>
          <div className="mt-4 space-y-2 text-neutral-700">
            <p>
              Nom de domaine, hébergement et certificat SSL inclus la première année. Ensuite
              99&nbsp;€ HT par an.
            </p>
            <p>Modification hors forfait : 49&nbsp;€ HT.</p>
            <p className="font-medium text-neutral-900">
              Un seul prix, pas d&apos;option, pas de remise.
            </p>
          </div>
          <OrderForm source="page" label="Commander — 500 € HT" size="lg" className="mt-7" />
        </div>
      </div>
    </section>
  );
}
