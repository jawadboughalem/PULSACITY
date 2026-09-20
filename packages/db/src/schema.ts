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
/** What a visitor asked for. `order_brief` is a filled brief, `notify` a line still in preparation. */
export const leadKindEnum = pgEnum('lead_kind', ['order_brief', 'notify', 'contact']);
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

/**
 * Any inbound request, whatever the offer line.
 *
 * `kind` says what was asked and therefore which fields are filled: a brief carries a
 * business and a phone, a « prévenez-moi » carries only an e-mail. Everything specific
 * to one form lives in `payload`, so a new line needs no migration.
 */
export const leads = pgTable(
  'leads',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    kind: leadKindEnum('kind').notNull(),
    /** The offer line this request is about, e.g. `creation-de-sites`. */
    lineSlug: text('line_slug'),
    businessName: text('business_name'),
    city: text('city'),
    /** Normalised to E.164 before insertion. */
    phoneE164: text('phone_e164'),
    email: text('email'),
    /** The form's own answers: pages wanted, sites liked, free description. */
    payload: jsonb('payload').notNull().default({}),
    status: leadStatusEnum('status').notNull().default('new'),
    /** Set once this request turned into a paid order. */
    convertedOrderId: uuid('converted_order_id'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('leads_created_at_idx').on(table.createdAt),
    index('leads_kind_idx').on(table.kind),
  ],
);

/** One paid Stripe Checkout Session. Written only by the webhook. */
export const orders = pgTable(
  'orders',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    stripeSessionId: text('stripe_session_id').notNull(),
    /** Which offer line was bought. Read back from the line's content file. */
    offerSlug: text('offer_slug').notNull(),
    /** The brief this order came from, when the buyer filled one first. */
    leadId: uuid('lead_id'),
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
export type LeadKind = (typeof leadKindEnum.enumValues)[number];
export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type Domain = typeof domains.$inferSelect;
export type SiteStatus = (typeof siteStatusEnum.enumValues)[number];
export type VatMode = (typeof vatModeEnum.enumValues)[number];
