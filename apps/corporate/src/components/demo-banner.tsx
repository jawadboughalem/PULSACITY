import { buttonVariants } from '@/components/ui/button';

/**
 * Fixed banner on every demo: what it is, what it costs, and how to take it.
 * A plain form post — no client JavaScript.
 */
export function DemoBanner({
  name,
  slug,
  city,
  siteId,
}: {
  name: string;
  slug: string;
  city?: string | null;
  siteId?: string;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-neutral-800 bg-neutral-900 text-white">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-snug">
          Démo préparée pour <span className="font-semibold">{name}</span> · 500&nbsp;€ HT tout
          compris · en ligne sous 72&nbsp;h
        </p>
        <form method="post" action="/api/checkout" className="shrink-0">
          <input type="hidden" name="source" value="demo" />
          <input type="hidden" name="demo_slug" value={slug} />
          {siteId ? <input type="hidden" name="site_id" value={siteId} /> : null}
          <input type="hidden" name="business_name" value={name} />
          {city ? <input type="hidden" name="city" value={city} /> : null}
          <button type="submit" className={buttonVariants({ size: 'sm' })}>
            Je le prends
          </button>
        </form>
      </div>
    </div>
  );
}
