import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  smallint,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { PLAN_IDS } from "../config/plans";
import type { ConnectionConfig, ConnectorId } from "../lib/connectors/types";

/** Every timestamp is stored with its time zone (timestamptz). */
function timestamptz(name: string) {
  return timestamp(name, { withTimezone: true });
}

// ---------------------------------------------------------------------------
// Better Auth
//
// Same tables, columns and indexes as `auth generate` (Better Auth 1.7, magic
// link plugin, Drizzle adapter for Postgres), with timestamptz columns.
// ---------------------------------------------------------------------------

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamptz("created_at").defaultNow().notNull(),
  updatedAt: timestamptz("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamptz("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamptz("created_at").defaultNow().notNull(),
    updatedAt: timestamptz("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamptz("access_token_expires_at"),
    refreshTokenExpiresAt: timestamptz("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamptz("created_at").defaultNow().notNull(),
    updatedAt: timestamptz("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamptz("expires_at").notNull(),
    createdAt: timestamptz("created_at").defaultNow().notNull(),
    updatedAt: timestamptz("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

// ---------------------------------------------------------------------------
// PULSACITY
// ---------------------------------------------------------------------------

export const planEnum = pgEnum("plan", PLAN_IDS);

export const connectionStatusEnum = pgEnum("connection_status", [
  "pending",
  "active",
  "error",
]);

export const purchaseSourceEnum = pgEnum("purchase_source", [
  "connector",
  "manual",
  "csv",
]);

export const reviewRequestStatusEnum = pgEnum("review_request_status", [
  "scheduled",
  "sent",
  "reminded",
  "completed",
  "cancelled",
  "failed",
]);

export const testimonialStatusEnum = pgEnum("testimonial_status", [
  "pending",
  "approved",
  "hidden",
]);

export const testimonialSourceEnum = pgEnum("testimonial_source", [
  "form",
  "manual",
  "csv",
]);

export const widgetTypeEnum = pgEnum("widget_type", [
  "wall",
  "carousel",
  "badge",
]);

export const spaces = pgTable(
  "spaces",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    logoUrl: text("logo_url"),
    accentColor: text("accent_color"),
    replyToEmail: text("reply_to_email").notNull(),
    plan: planEnum("plan").notNull().default("free"),
    stripeCustomerId: text("stripe_customer_id").unique(),
    stripeSubscriptionId: text("stripe_subscription_id").unique(),
    referralCode: text("referral_code").notNull().unique(),
    createdAt: timestamptz("created_at").notNull().defaultNow(),
  },
  (table) => [index("spaces_user_id_idx").on(table.userId)],
);

/** A space's link to one platform account, fed by a secret webhook URL. */
export const connections = pgTable(
  "connections",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    spaceId: uuid("space_id")
      .notNull()
      .references(() => spaces.id, { onDelete: "cascade" }),
    /** Open list, checked against the connector registry. */
    connector: text("connector").$type<ConnectorId>().notNull(),
    /** Secret part of the webhook URL. Regenerating it revokes the old URL. */
    webhookToken: text("webhook_token").notNull().unique(),
    status: connectionStatusEnum("status").notNull().default("pending"),
    lastEventAt: timestamptz("last_event_at"),
    config: jsonb("config").$type<ConnectionConfig>().notNull().default({}),
    createdAt: timestamptz("created_at").notNull().defaultNow(),
  },
  (table) => [index("connections_space_id_idx").on(table.spaceId)],
);

/** The creator's offers: a course, a coaching programme, a session… */
export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    spaceId: uuid("space_id")
      .notNull()
      .references(() => spaces.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    requestDelayDays: integer("request_delay_days").notNull().default(14),
    requestsEnabled: boolean("requests_enabled").notNull().default(true),
    createdAt: timestamptz("created_at").notNull().defaultNow(),
  },
  // The slug is the offer's segment in /t/[spaceSlug]/[productSlug].
  (table) => [unique("products_space_id_slug_unique").on(table.spaceId, table.slug)],
);

/** Links an offer to its identifier on each connected platform. */
export const productRefs = pgTable(
  "product_refs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    connectionId: uuid("connection_id")
      .notNull()
      .references(() => connections.id, { onDelete: "cascade" }),
    externalRef: text("external_ref").notNull(),
  },
  (table) => [
    // An incoming offer reference resolves to a single offer.
    unique("product_refs_connection_id_external_ref_unique").on(
      table.connectionId,
      table.externalRef,
    ),
    index("product_refs_product_id_idx").on(table.productId),
  ],
);

/** The creator's own customers. PULSACITY processes them on the creator's behalf. */
export const customers = pgTable(
  "customers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    spaceId: uuid("space_id")
      .notNull()
      .references(() => spaces.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    firstName: text("first_name"),
    lastName: text("last_name"),
    unsubscribedAt: timestamptz("unsubscribed_at"),
    createdAt: timestamptz("created_at").notNull().defaultNow(),
  },
  (table) => [
    unique("customers_space_id_email_unique").on(table.spaceId, table.email),
    // Keeps the unique pair case-insensitive: one person, one customer, so
    // never more than two emails per customer and per offer.
    check("customers_email_lowercase_check", sql`${table.email} = lower(${table.email})`),
  ],
);

export const purchases = pgTable(
  "purchases",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    spaceId: uuid("space_id")
      .notNull()
      .references(() => spaces.id, { onDelete: "cascade" }),
    customerId: uuid("customer_id")
      .notNull()
      .references(() => customers.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    connectionId: uuid("connection_id").references(() => connections.id, {
      onDelete: "set null",
    }),
    source: purchaseSourceEnum("source").notNull(),
    eventType: text("event_type"),
    externalRef: text("external_ref"),
    purchasedAt: timestamptz("purchased_at").notNull(),
  },
  (table) => [
    index("purchases_space_id_idx").on(table.spaceId),
    index("purchases_customer_id_product_id_idx").on(table.customerId, table.productId),
    index("purchases_product_id_idx").on(table.productId),
    index("purchases_connection_id_idx").on(table.connectionId),
  ],
);

export const reviewRequests = pgTable(
  "review_requests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** One request per purchase: the first email and its single reminder. */
    purchaseId: uuid("purchase_id")
      .notNull()
      .unique()
      .references(() => purchases.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    scheduledAt: timestamptz("scheduled_at").notNull(),
    /** Set once, when the email leaves: the lock that makes sending idempotent. */
    sentAt: timestamptz("sent_at"),
    reminderScheduledAt: timestamptz("reminder_scheduled_at"),
    reminderSentAt: timestamptz("reminder_sent_at"),
    completedAt: timestamptz("completed_at"),
    status: reviewRequestStatusEnum("status").notNull().default("scheduled"),
  },
  (table) => [
    // What the cron job looks for: requests and reminders that are due.
    index("review_requests_status_scheduled_at_idx").on(table.status, table.scheduledAt),
    index("review_requests_status_reminder_scheduled_at_idx").on(
      table.status,
      table.reminderScheduledAt,
    ),
  ],
);

export const testimonials = pgTable(
  "testimonials",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    spaceId: uuid("space_id")
      .notNull()
      .references(() => spaces.id, { onDelete: "cascade" }),
    productId: uuid("product_id").references(() => products.id, { onDelete: "set null" }),
    customerId: uuid("customer_id").references(() => customers.id, { onDelete: "cascade" }),
    authorName: text("author_name").notNull(),
    authorTitle: text("author_title"),
    authorPhotoUrl: text("author_photo_url"),
    rating: smallint("rating").notNull(),
    body: text("body").notNull(),
    status: testimonialStatusEnum("status").notNull().default("pending"),
    source: testimonialSourceEnum("source").notNull(),
    consentAt: timestamptz("consent_at"),
    consentText: text("consent_text"),
    featured: boolean("featured").notNull().default(false),
    createdAt: timestamptz("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("testimonials_space_id_status_idx").on(table.spaceId, table.status),
    index("testimonials_product_id_idx").on(table.productId),
    index("testimonials_customer_id_idx").on(table.customerId),
    check("testimonials_rating_check", sql`${table.rating} between 1 and 5`),
    // Every testimonial left through a form carries a dated, explicit consent
    // to its publication (CLAUDE.md, absolute rule 5).
    check(
      "testimonials_form_consent_check",
      sql`${table.source} <> 'form' or (${table.consentAt} is not null and ${table.consentText} is not null)`,
    ),
  ],
);

/** Display settings of a widget. Absent keys fall back to the widget defaults. */
export type WidgetSettings = {
  theme?: "light" | "dark" | "auto";
  accentColor?: string;
  maxItems?: number;
  showRating?: boolean;
  showPhoto?: boolean;
};

export const widgets = pgTable(
  "widgets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    spaceId: uuid("space_id")
      .notNull()
      .references(() => spaces.id, { onDelete: "cascade" }),
    type: widgetTypeEnum("type").notNull(),
    /** `null`: the testimonials of every offer. */
    productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }),
    settings: jsonb("settings").$type<WidgetSettings>().notNull().default({}),
    createdAt: timestamptz("created_at").notNull().defaultNow(),
  },
  (table) => [index("widgets_space_id_idx").on(table.spaceId)],
);

/** Every webhook received, stored raw before any processing, and replayable. */
export const webhookEvents = pgTable(
  "webhook_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    connectionId: uuid("connection_id")
      .notNull()
      .references(() => connections.id, { onDelete: "cascade" }),
    rawPayload: jsonb("raw_payload").notNull(),
    headers: jsonb("headers").$type<Record<string, string>>().notNull(),
    eventType: text("event_type"),
    receivedAt: timestamptz("received_at").notNull().defaultNow(),
    processedAt: timestamptz("processed_at"),
    error: text("error"),
  },
  (table) => [
    index("webhook_events_connection_id_received_at_idx").on(
      table.connectionId,
      table.receivedAt,
    ),
  ],
);

/** Stripe events already handled, keyed by the Stripe event id. */
export const stripeEvents = pgTable("stripe_events", {
  id: text("id").primaryKey(),
  type: text("type").notNull(),
  processedAt: timestamptz("processed_at").notNull().defaultNow(),
});
