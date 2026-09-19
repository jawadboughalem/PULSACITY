/**
 * Every database read/write the corporate app performs.
 *
 * Keeping them here means the app never assembles SQL itself, and the trigram search
 * has exactly one definition.
 */
import { and, eq, gt, isNull, or, sql } from 'drizzle-orm';

import { getDb } from './client';
import { domains, leads, orders, sites, stripeEvents, type NewLead, type NewOrder } from './schema';

/** Matching threshold for the « mon site est-il déjà prêt ? » search. */
export const SITE_SEARCH_THRESHOLD = 0.4;
/** A search never returns more than this many demos to choose from. */
export const SITE_SEARCH_LIMIT = 5;
/** Fallback lifetime for a demo that carries no explicit `expires_at`. */
export const DEFAULT_DEMO_TTL_DAYS = 30;

/**
 * `status = 'demo'` and still within its lifetime.
 *
 * An explicit `expires_at` wins; without one the demo lives `ttlDays` from creation, so
 * a demo can never stay online indefinitely by accident.
 */
const liveDemo = (ttlDays: number) =>
  and(
    eq(sites.status, 'demo'),
    or(
      gt(sites.expiresAt, sql`now()`),
      and(
        isNull(sites.expiresAt),
        gt(sites.createdAt, sql`now() - (${ttlDays} * interval '1 day')`),
      ),
    ),
  );

/** The same rule, inline, for the raw-SQL search below. */
const liveDemoSql = (ttlDays: number) => sql`
  s.status = 'demo'
  and (
    s.expires_at > now()
    or (s.expires_at is null and s.created_at > now() - (${ttlDays} * interval '1 day'))
  )
`;

export interface DemoSiteMatch {
  id: string;
  slug: string;
  name: string;
  city: string | null;
  score: number;
}

/**
 * Trigram search over accent- and case-folded business names.
 *
 * `pulsacity_unaccent` is the IMMUTABLE wrapper created by the migration; it is what
 * the GIN index is built on, so the index is actually used.
 */
export async function searchDemoSites(
  query: string,
  options: { city?: string | null; threshold?: number; limit?: number; ttlDays?: number } = {},
): Promise<DemoSiteMatch[]> {
  const threshold = options.threshold ?? SITE_SEARCH_THRESHOLD;
  const limit = options.limit ?? SITE_SEARCH_LIMIT;
  const ttlDays = options.ttlDays ?? DEFAULT_DEMO_TTL_DAYS;
  const city = options.city?.trim() ? options.city.trim() : null;

  const rows = await getDb().execute<{
    id: string;
    slug: string;
    name: string;
    city: string | null;
    score: number;
    city_match: boolean;
  }>(sql`
    select
      s.id,
      s.slug,
      s.name,
      s.city,
      similarity(pulsacity_unaccent(lower(s.name)), pulsacity_unaccent(lower(${query}))) as score,
      case
        when ${city}::text is null or s.city is null then false
        else pulsacity_unaccent(lower(s.city)) = pulsacity_unaccent(lower(${city}))
      end as city_match
    from sites s
    where ${liveDemoSql(ttlDays)}
      and similarity(pulsacity_unaccent(lower(s.name)), pulsacity_unaccent(lower(${query}))) >= ${threshold}
    order by city_match desc, score desc, s.name asc
    limit ${limit}
  `);

  return Array.from(rows).map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    city: row.city,
    score: Number(row.score),
  }));
}

/** The demo behind `demo.pulsacity.com/<slug>`, or `null` when missing or expired. */
export async function findLiveDemoBySlug(slug: string, ttlDays = DEFAULT_DEMO_TTL_DAYS) {
  const rows = await getDb()
    .select()
    .from(sites)
    .where(and(eq(sites.slug, slug), liveDemo(ttlDays)))
    .limit(1);
  return rows[0] ?? null;
}

/** Host lookup for domains that are neither the corporate nor the demo host. */
export async function findDomain(host: string) {
  const rows = await getDb().select().from(domains).where(eq(domains.host, host)).limit(1);
  return rows[0] ?? null;
}

export async function insertLead(lead: NewLead) {
  const rows = await getDb().insert(leads).values(lead).returning({ id: leads.id });
  return rows[0] ?? null;
}

/**
 * Records a Stripe event id. Returns `false` when the id was already present, which is
 * how the webhook stays idempotent under Stripe's at-least-once delivery.
 */
export async function recordStripeEvent(id: string, type: string): Promise<boolean> {
  const rows = await getDb()
    .insert(stripeEvents)
    .values({ id, type })
    .onConflictDoNothing({ target: stripeEvents.id })
    .returning({ id: stripeEvents.id });
  return rows.length > 0;
}

/**
 * Releases a claimed event id so Stripe's next retry can process it again. Called when
 * handling failed after the claim was written.
 */
export async function releaseStripeEvent(id: string): Promise<void> {
  await getDb().delete(stripeEvents).where(eq(stripeEvents.id, id));
}

/** Inserts an order. Returns `null` when that Checkout Session was already recorded. */
export async function insertOrder(order: NewOrder) {
  const rows = await getDb()
    .insert(orders)
    .values(order)
    .onConflictDoNothing({ target: orders.stripeSessionId })
    .returning();
  return rows[0] ?? null;
}

/** Marks a sold demo. Going live is a separate, manual step until S2. */
export async function markSiteSold(siteId: string, soldAt: Date) {
  await getDb()
    .update(sites)
    .set({ status: 'sold', soldAt, updatedAt: new Date() })
    .where(eq(sites.id, siteId));
}
