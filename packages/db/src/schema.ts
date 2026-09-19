/**
 * Database schema (Drizzle / Postgres).
 *
 * Money is stored in cents, timestamps in UTC (`timestamptz`); display formatting in
 * `Europe/Paris` is the application's job.
 */
import { sql } from 'drizzle-orm';
import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

export const siteStatusEnum = pgEnum('site_status', ['demo', 'sold', 'live', 'archived']);
export const leadStatusEnum = pgEnum('lead_status', ['new', 'contacted', 'converted', 'rejected']);
export const orderStatusEnum = pgEnum('order_status', ['paid']);
export const domainTypeEnum = pgEnum('domain_type', ['corporate', 'demo', 'client']);
export const vatModeEnum = pgEnum('vat_mode', ['franchise', 'standard']);

/**
 * Host → tenant routing table. V0 only ever holds the corporate and demo hosts;
 * per-domain client sites arrive in S2.
 */
export const domains = pgTable('domains', {
  host: text('host').primaryKey(),
  tenantId: uuid('tenant_id'),
  type: domainTypeEnum('type').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

/** One prepared site per prospect. Built from a real Google listing, never invented. */
export const sites = pgTable(
  'sites',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    slug: text('slug').notNull(),
    name: text('name').notNull(),
    city: text('city'),
    /** Prospecting block the site was produced from (radar, S2). */
    block: text('block'),
    status: siteStatusEnum('status').notNull().default('demo'),
    /** Validated against `SiteContent` from @pulsacity/templates before rendering. */
    content: jsonb('content').notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    soldAt: timestamp('sold_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('sites_slug_key').on(table.slug),
    index('sites_status_idx').on(table.status),
  ],
);

/** Inbound request from the « Votre site est peut-être déjà prêt » form. */
export const leads = pgTable(
  'leads',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    businessName: text('business_name').notNull(),
    city: text('city'),
    /** Normalised to E.164 before insertion. */
    phoneE164: text('phone_e164').notNull(),
    email: text('email'),
    source: text('source').notNull(),
    status: leadStatusEnum('status').notNull().default('new'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('leads_created_at_idx').on(table.createdAt)],
);

/** One paid Stripe Checkout Session. Written only by the webhook. */
export const orders = pgTable(
  'orders',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    stripeSessionId: text('stripe_session_id').notNull(),
    paymentIntentId: text('payment_intent_id'),
    amountTotalCents: integer('amount_total_cents').notNull(),
    currency: text('currency').notNull(),
    customerEmail: text('customer_email'),
    customerPhone: text('customer_phone'),
    businessName: text('business_name'),
    city: text('city'),
    siteId: uuid('site_id').references(() => sites.id, { onDelete: 'set null' }),
    vatMode: vatModeEnum('vat_mode').notNull(),
    status: orderStatusEnum('status').notNull().default('paid'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex('orders_stripe_session_id_key').on(table.stripeSessionId)],
);

/** Idempotence ledger: a Stripe event id is processed at most once. */
export const stripeEvents = pgTable('stripe_events', {
  id: text('id').primaryKey(),
  type: text('type').notNull(),
  receivedAt: timestamp('received_at', { withTimezone: true }).notNull().defaultNow(),
});

export type Site = typeof sites.$inferSelect;
export type NewSite = typeof sites.$inferInsert;
export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type Domain = typeof domains.$inferSelect;
export type SiteStatus = (typeof siteStatusEnum.enumValues)[number];
export type VatMode = (typeof vatModeEnum.enumValues)[number];
