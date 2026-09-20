/**
 * Every database read/write the corporate app performs.
 *
 * Keeping them here means the app never assembles SQL itself.
 */
import { and, eq, gt, isNull, or, sql } from 'drizzle-orm';

import { getDb } from './client';
import { domains, leads, orders, sites, stripeEvents, type NewLead, type NewOrder } from './schema';

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

/** Links a brief to the order it became, once the payment went through. */
export async function markLeadConverted(leadId: string, orderId: string): Promise<void> {
  await getDb()
    .update(leads)
    .set({ status: 'converted', convertedOrderId: orderId })
    .where(eq(leads.id, leadId));
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
