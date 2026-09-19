import { OrderForm } from '@/components/order-form';
import { buttonVariants } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 pb-14 pt-16 sm:pb-20 sm:pt-24">
      <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
        Le site de votre entreprise, déjà prêt.
      </h1>
      <p className="mt-5 max-w-2xl text-lg text-neutral-600">
        Site vitrine complet, nom de domaine et hébergement inclus la première année. 500&nbsp;€ HT
        tout compris, en ligne sous 72&nbsp;h. Sans engagement : le site et le domaine sont à vous.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <a href="#mon-site" className={buttonVariants({ size: 'lg' })}>
          Voir si mon site est déjà prêt
        </a>
        <OrderForm source="page" label="Commander — 500 € HT" variant="secondary" size="lg" />
      </div>
    </section>
  );
}
