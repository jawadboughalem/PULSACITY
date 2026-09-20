import { OrderForm } from '@/components/order-form';
import { Container } from '@/components/ui/container';
import { Surface } from '@/components/ui/surface';

/**
 * Fixed banner on every demo. The site already exists, so the button goes
 * straight to payment rather than through the brief.
 *
 * An inked surface like any other: `surface-inverted` redeclares the tokens, so
 * nothing here names a colour for the dark background it sits on.
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
    <Surface
      as="div"
      tone="inverted"
      className="border-line-strong fixed inset-x-0 bottom-0 z-50 border-t"
    >
      <Container
        width="narrow"
        className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <p className="text-ink text-body-sm leading-snug">
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
      </Container>
    </Surface>
  );
}
