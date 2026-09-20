import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * A plain HTML form posting to `/api/checkout`, which answers with a redirect to
 * Stripe. The price is never in the page: the route reads it from the line's file.
 */
export interface OrderFormProps {
  offer: string;
  source: 'page' | 'demo';
  demoSlug?: string;
  siteId?: string;
  leadId?: string;
  businessName?: string;
  city?: string;
  label: string;
  variant?: 'default' | 'secondary';
  size?: 'default' | 'lg' | 'sm';
  className?: string;
}

export function OrderForm({
  offer,
  source,
  demoSlug,
  siteId,
  leadId,
  businessName,
  city,
  label,
  variant = 'default',
  size = 'default',
  className,
}: OrderFormProps) {
  return (
    <form method="post" action="/api/checkout" className={cn('inline-block', className)}>
      <input type="hidden" name="offer" value={offer} />
      <input type="hidden" name="source" value={source} />
      {demoSlug ? <input type="hidden" name="demo_slug" value={demoSlug} /> : null}
      {siteId ? <input type="hidden" name="site_id" value={siteId} /> : null}
      {leadId ? <input type="hidden" name="lead_id" value={leadId} /> : null}
      {businessName ? <input type="hidden" name="business_name" value={businessName} /> : null}
      {city ? <input type="hidden" name="city" value={city} /> : null}
      <button type="submit" className={buttonVariants({ variant, size })}>
        {label}
      </button>
    </form>
  );
}
