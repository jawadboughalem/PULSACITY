import { OrderForm } from '@/components/order-form';

/**
 * Fixed banner on every demo. The site already exists, so the button goes straight
 * to payment rather than through the brief.
 */
export function DemoBanner({
  name,
  slug,
  city,
  siteId,
  offerSlug,
  priceLabel,
}: {
  name: string;
  slug: string;
  city?: string | null;
  siteId?: string;
  offerSlug: string;
  priceLabel: string;
}) {
  return (
    <div className="border-line-strong bg-ink text-ground fixed inset-x-0 bottom-0 z-50 border-t">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-snug">
          Démo préparée pour <span className="font-semibold">{name}</span> · {priceLabel} tout
          compris · en ligne sous 72&nbsp;h
        </p>
        <OrderForm
          offer={offerSlug}
          source="demo"
          demoSlug={slug}
          {...(siteId ? { siteId } : {})}
          businessName={name}
          {...(city ? { city } : {})}
          label="Je le prends"
          size="sm"
          className="shrink-0"
        />
      </div>
    </div>
  );
}
