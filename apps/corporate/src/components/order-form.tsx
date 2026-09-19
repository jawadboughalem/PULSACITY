import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * « Commander » — a plain HTML form posting to `/api/checkout`, which answers with a
 * redirect to Stripe. No client JavaScript is involved.
 */
export interface OrderFormProps {
  source: 'page' | 'demo';
  demoSlug?: string;
  siteId?: string;
  businessName?: string;
  city?: string;
  label: string;
  variant?: 'default' | 'secondary';
  size?: 'default' | 'lg';
  className?: string;
}

export function OrderForm({
  source,
  demoSlug,
  siteId,
  businessName,
  city,
  label,
  variant = 'default',
  size = 'default',
  className,
}: OrderFormProps) {
  return (
    <form method="post" action="/api/checkout" className={cn('inline-block', className)}>
      <input type="hidden" name="source" value={source} />
      {demoSlug ? <input type="hidden" name="demo_slug" value={demoSlug} /> : null}
      {siteId ? <input type="hidden" name="site_id" value={siteId} /> : null}
      {businessName ? <input type="hidden" name="business_name" value={businessName} /> : null}
      {city ? <input type="hidden" name="city" value={city} /> : null}
      <button type="submit" className={buttonVariants({ variant, size })}>
        {label}
      </button>
    </form>
  );
}
