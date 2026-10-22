import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  uniqueIndex,
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
import { WIDGET_TYPES, type WidgetCardStyle, type WidgetTheme } from "../../widget/src/payload";
import { type BillingPeriod, PLAN_IDS, type PriceList } from "../config/plans";
import type { ConnectionConfig, WebhookHeaders } from "../lib/connectors/types";
import type { WebhookEventError, WebhookEventOutcome } from "../lib/connectors/webhook-event-states";
import type { HeardFrom } from "../lib/acquisition/heard-from";
import type { ReferralReward } from "../lib/referrals/referral-reward";
import type { WelcomeEmailStep } from "../lib/welcome-emails/welcome-email-steps";
import { DEFAULT_REQUEST_DELAY_DAYS } from "../lib/requests/request-timing";
import type { HiddenReason } from "../lib/testimonials/hidden-reasons";
import type { CorrectionOutcome } from "../lib/testimonials/corrections/correction-outcome";
import type { TestimonialProvenance } from "../lib/testimonials/testimonial-provenance";

function timestamptz(name: string) {
  return timestamp(name, { withTimezone: true });
}

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
}).enableRLS();

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
).enableRLS();

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
).enableRLS();

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
).enableRLS();

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

export const widgetTypeEnum = pgEnum("widget_type", WIDGET_TYPES);

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
    collectionLinkSharedAt: timestamptz("collection_link_shared_at"),
    firstDayCelebratedAt: timestamptz("first_day_celebrated_at"),
    firstApprovalCelebratedAt: timestamptz("first_approval_celebrated_at"),
    /** Réglages: the sender's postal address, in small at the bottom of the e-mails to customers. Lines kept. */
    senderPostalAddress: text("sender_postal_address"),
    /** Réglages: the creator gets « Nouveau témoignage » at each testimonial received. */
    newTestimonialEmailEnabled: boolean("new_testimonial_email_enabled").notNull().default(true),
    /** Réglages, « J'offre une contrepartie à mes clients »: since when it is declared. Null: no counterpart. */
    incentiveDeclaredAt: timestamptz("incentive_declared_at"),
    /** When the space went back to the free plan after a subscription: « repassé au plan Gratuit le … ». */
    freeSince: timestamptz("free_since"),
    /** « Ne plus recevoir les e-mails d'accueil »: none of J0 to J7 leaves after this. */
    welcomeEmailsUnsubscribedAt: timestamptz("welcome_emails_unsubscribed_at"),
    /** Parrainage, on the free plan: the months of Essentiel offered by paying referees run until this date. */
    referralEssentielUntil: timestamptz("referral_essentiel_until"),
    createdAt: timestamptz("created_at").notNull().defaultNow(),
  },
  (table) => [index("spaces_user_id_idx").on(table.userId)],
).enableRLS();

/**
 * Where a space came from, recorded once when it is created (lot 4.12): the words of the address the creator signed
 * up from, carried through the sign-in link, and the answer to « Comment avez-vous connu PULSACITY ? ». Nothing about
 * the person: the source, never who.
 */
export const spaceAcquisitions = pgTable("space_acquisitions", {
  spaceId: uuid("space_id")
    .primaryKey()
    .references(() => spaces.id, { onDelete: "cascade" }),
  heardFrom: text("heard_from").$type<HeardFrom>(),
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  utmContent: text("utm_content"),
  utmTerm: text("utm_term"),
  /** The referral code of the address (badge « Propulsé par », referral link), as received, known or not. */
  referralCode: text("referral_code"),
  createdAt: timestamptz("created_at").notNull().defaultNow(),
}).enableRLS();

/**
 * A space created from another space's referral link or badge. The referrer earns a month of Essentiel at the
 * referee's first payment with money, once: `rewardedAt` is the lock. A deleted referee keeps the reward it earned.
 */
export const referrals = pgTable(
  "referrals",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    referrerSpaceId: uuid("referrer_space_id")
      .notNull()
      .references(() => spaces.id, { onDelete: "cascade" }),
    refereeSpaceId: uuid("referee_space_id")
      .unique()
      .references(() => spaces.id, { onDelete: "set null" }),
    createdAt: timestamptz("created_at").notNull().defaultNow(),
    rewardedAt: timestamptz("rewarded_at"),
    /** « credit »: a month of Essentiel taken off the next payments; « free-month »: Essentiel for a month, on the free plan. */
    reward: text("reward").$type<ReferralReward>(),
    /** The referee's invoice (in_…) whose payment earned the month. */
    rewardInvoiceId: text("reward_invoice_id"),
  },
  (table) => [index("referrals_referrer_space_id_idx").on(table.referrerSpaceId)],
).enableRLS();

/**
 * The welcome e-mails J0, J1, J3 and J7 of a space: a row is written before the e-mail leaves (the lock), so that each
 * goes once at most. `skippedAt`: its step was done before it was due, it never leaves.
 */
export const welcomeEmails = pgTable(
  "welcome_emails",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    spaceId: uuid("space_id")
      .notNull()
      .references(() => spaces.id, { onDelete: "cascade" }),
    step: text("step").$type<WelcomeEmailStep>().notNull(),
    claimedAt: timestamptz("claimed_at").notNull().defaultNow(),
    sentAt: timestamptz("sent_at"),
    skippedAt: timestamptz("skipped_at"),
  },
  (table) => [unique("welcome_emails_space_id_step_unique").on(table.spaceId, table.step)],
).enableRLS();

export const connections = pgTable(
  "connections",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    spaceId: uuid("space_id")
      .notNull()
      .references(() => spaces.id, { onDelete: "cascade" }),
    connector: text("connector").notNull(),
    webhookToken: text("webhook_token").notNull().unique(),
    status: connectionStatusEnum("status").notNull().default("pending"),
    lastEventAt: timestamptz("last_event_at"),
    config: jsonb("config").$type<ConnectionConfig>().notNull().default({}),
    createdAt: timestamptz("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("connections_space_id_idx").on(table.spaceId),
    unique("connections_space_id_connector_unique").on(table.spaceId, table.connector),
  ],
).enableRLS();

export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    spaceId: uuid("space_id")
      .notNull()
      .references(() => spaces.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    requestDelayDays: integer("request_delay_days").notNull().default(DEFAULT_REQUEST_DELAY_DAYS),
    requestsEnabled: boolean("requests_enabled").notNull().default(true),
    createdAt: timestamptz("created_at").notNull().defaultNow(),
  },
  (table) => [unique("products_space_id_slug_unique").on(table.spaceId, table.slug)],
).enableRLS();

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
    unique("product_refs_connection_id_external_ref_unique").on(
      table.connectionId,
      table.externalRef,
    ),
    index("product_refs_product_id_idx").on(table.productId),
  ],
).enableRLS();

/** A product as the connector names it, seen with a sale: « à associer » until a product_ref links it to an offer. */
export const externalProducts = pgTable(
  "external_products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    connectionId: uuid("connection_id")
      .notNull()
      .references(() => connections.id, { onDelete: "cascade" }),
    externalRef: text("external_ref").notNull(),
    name: text("name").notNull(),
    priceCents: integer("price_cents"),
    currency: text("currency"),
    firstSeenAt: timestamptz("first_seen_at").notNull(),
    /** What brought it the first time: a sale, or an enrollment without one (« première inscription »). */
    eventType: text("event_type").$type<"sale" | "enrollment">(),
  },
  (table) => [
    unique("external_products_connection_id_external_ref_unique").on(table.connectionId, table.externalRef),
  ],
).enableRLS();

/** « Me prévenir » on a connector to come, or the tool named after « Dites-nous quel outil ». */
export const connectorWaitlist = pgTable(
  "connector_waitlist",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    spaceId: uuid("space_id")
      .notNull()
      .references(() => spaces.id, { onDelete: "cascade" }),
    connector: text("connector").notNull(),
    toolName: text("tool_name"),
    createdAt: timestamptz("created_at").notNull().defaultNow(),
  },
  (table) => [
    unique("connector_waitlist_space_id_connector_tool_name_unique")
      .on(table.spaceId, table.connector, table.toolName)
      .nullsNotDistinct(),
  ],
).enableRLS();

/**
 * « Me prévenir » of the public connector pages (/integrations/stripe): a visitor without a space leaves an address.
 * Deleted once the announcement is sent (politique de confidentialité).
 */
export const connectorWaitlistEmails = pgTable(
  "connector_waitlist_emails",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    connector: text("connector").notNull(),
    email: text("email").notNull(),
    createdAt: timestamptz("created_at").notNull().defaultNow(),
  },
  (table) => [unique("connector_waitlist_emails_connector_email_unique").on(table.connector, table.email)],
).enableRLS();

/**
 * « Dites-nous quel outil » of /integrations: a visitor without a space names the tool where they sell. Only the name
 * is kept, without any address, to count the tools asked for and choose the next connectors.
 */
export const toolSuggestions = pgTable("tool_suggestions", {
  id: uuid("id").primaryKey().defaultRandom(),
  toolName: text("tool_name").notNull(),
  createdAt: timestamptz("created_at").notNull().defaultNow(),
}).enableRLS();

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
    check("customers_email_lowercase_check", sql`${table.email} = lower(${table.email})`),
  ],
).enableRLS();

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
    /** When PULSACITY recorded it: counts the requests typed in by hand today (`manualRequestsPerDay`). */
    createdAt: timestamptz("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("purchases_space_id_idx").on(table.spaceId),
    index("purchases_customer_id_product_id_idx").on(table.customerId, table.productId),
    index("purchases_product_id_idx").on(table.productId),
    index("purchases_connection_id_idx").on(table.connectionId),
    unique("purchases_connection_id_external_ref_unique").on(table.connectionId, table.externalRef),
  ],
).enableRLS();

export const reviewRequests = pgTable(
  "review_requests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    purchaseId: uuid("purchase_id")
      .notNull()
      .unique()
      .references(() => purchases.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    scheduledAt: timestamptz("scheduled_at").notNull(),
    sentAt: timestamptz("sent_at"),
    reminderScheduledAt: timestamptz("reminder_scheduled_at"),
    reminderSentAt: timestamptz("reminder_sent_at"),
    completedAt: timestamptz("completed_at"),
    status: reviewRequestStatusEnum("status").notNull().default("scheduled"),
    /** Sends that failed in a row: past the limit, the request stops retrying and shows « Échec ». */
    failedAttempts: integer("failed_attempts").notNull().default(0),
    /** When it was cancelled (by the creator, an unsubscription, or requests turned off): « Annulée le … ». */
    cancelledAt: timestamptz("cancelled_at"),
    /** When the last try failed and the request stopped retrying: « Non envoyée le … ». */
    failedAt: timestamptz("failed_at"),
  },
  (table) => [
    index("review_requests_status_scheduled_at_idx").on(table.status, table.scheduledAt),
    index("review_requests_status_reminder_scheduled_at_idx").on(
      table.status,
      table.reminderScheduledAt,
    ),
  ],
).enableRLS();

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
    displayBody: text("display_body"),
    displayEditedAt: timestamptz("display_edited_at"),
    status: testimonialStatusEnum("status").notNull().default("pending"),
    source: testimonialSourceEnum("source").notNull(),
    consentAt: timestamptz("consent_at"),
    consentText: text("consent_text"),
    featured: boolean("featured").notNull().default(false),
    createdAt: timestamptz("created_at").notNull().defaultNow(),
    /** Vente reçue, demande manuelle, ajout, import ou lien public (lot 4.13). Null: written before, read from source. */
    provenance: text("provenance").$type<TestimonialProvenance>(),
    /** The request it answers, while it exists. The provenance and the purchase stay when it is gone. */
    reviewRequestId: uuid("review_request_id").references(() => reviewRequests.id, { onDelete: "set null" }),
    /** The purchase the request followed (sale or « Demander un avis »): « achat en août 2026 » in the widgets. */
    purchasedAt: timestamptz("purchased_at"),
    /** The connector of the sale (« Vente reçue · Systeme.io »). */
    purchaseConnector: text("purchase_connector"),
    /** When « Masquer » was last confirmed, with its reason. Cleared when the testimonial is validated again. */
    hiddenAt: timestamptz("hidden_at"),
    hiddenReason: text("hidden_reason").$type<HiddenReason>(),
    /** The words of « Autre motif ». */
    hiddenReasonDetail: text("hidden_reason_detail"),
    /** The reason left by e-mail to the author: once per testimonial, whatever happens next. */
    hiddenReasonSentAt: timestamptz("hidden_reason_sent_at"),
  },
  (table) => [
    index("testimonials_space_id_status_idx").on(table.spaceId, table.status),
    index("testimonials_product_id_idx").on(table.productId),
    index("testimonials_customer_id_idx").on(table.customerId),
    check("testimonials_rating_check", sql`${table.rating} between 1 and 5`),
    check(
      "testimonials_form_consent_check",
      sql`${table.source} <> 'form' or (${table.consentAt} is not null and ${table.consentText} is not null)`,
    ),
  ],
).enableRLS();

/**
 * « Corriger le texte affiché » (lot 4.13, point 4): a correction is proposed to the author by e-mail, and shows only
 * once accepted. The original body never changes. One correction waits at a time.
 */
export const testimonialCorrections = pgTable(
  "testimonial_corrections",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    testimonialId: uuid("testimonial_id")
      .notNull()
      .references(() => testimonials.id, { onDelete: "cascade" }),
    /** The text shown when it was proposed: « Votre texte » of the e-mail. */
    fromBody: text("from_body").notNull(),
    /** « Le texte corrigé ». */
    body: text("body").notNull(),
    /** In the link of the e-mail: only its receiver can answer. */
    token: text("token").notNull().unique(),
    createdAt: timestamptz("created_at").notNull().defaultNow(),
    sentAt: timestamptz("sent_at"),
    answeredAt: timestamptz("answered_at"),
    /** Null while it waits: « accepted », « refused » by the author, or « cancelled » by the creator. */
    outcome: text("outcome").$type<CorrectionOutcome>(),
  },
  (table) => [
    index("testimonial_corrections_testimonial_id_idx").on(table.testimonialId),
    uniqueIndex("testimonial_corrections_one_waiting_unique")
      .on(table.testimonialId)
      .where(sql`${table.outcome} is null`),
  ],
).enableRLS();

export type WidgetSettings = {
  theme?: WidgetTheme;
  accentColor?: string | null;
  maxItems?: number;
  showRating?: boolean;
  showPhoto?: boolean;
  showDate?: boolean;
  hidePoweredBy?: boolean;
  cardStyle?: WidgetCardStyle;
};

export const widgets = pgTable(
  "widgets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    spaceId: uuid("space_id")
      .notNull()
      .references(() => spaces.id, { onDelete: "cascade" }),
    /** The creator's own name for the widget, never shown to visitors. Null: named after its type and offer. */
    name: text("name"),
    type: widgetTypeEnum("type").notNull(),
    productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }),
    settings: jsonb("settings").$type<WidgetSettings>().notNull().default({}),
    firstLoadedAt: timestamptz("first_loaded_at"),
    /** The last time a page showed it, to the hour: « widgets chargés dans les 7 derniers jours » (lot 4.12). */
    lastLoadedAt: timestamptz("last_loaded_at"),
    /** « Afficher celui-ci à la place »: on the free plan, the widget chosen last shows, the others are paused. */
    freePlanChosenAt: timestamptz("free_plan_chosen_at"),
    createdAt: timestamptz("created_at").notNull().defaultNow(),
  },
  (table) => [index("widgets_space_id_idx").on(table.spaceId)],
).enableRLS();

export const webhookEvents = pgTable(
  "webhook_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    connectionId: uuid("connection_id")
      .notNull()
      .references(() => connections.id, { onDelete: "cascade" }),
    rawPayload: jsonb("raw_payload").notNull(),
    /** The bytes received, exactly: a signature is computed on them, and JSON does not keep them. */
    rawBody: text("raw_body"),
    headers: jsonb("headers").$type<WebhookHeaders>().notNull(),
    eventType: text("event_type"),
    receivedAt: timestamptz("received_at").notNull().defaultNow(),
    processedAt: timestamptz("processed_at"),
    outcome: text("outcome").$type<WebhookEventOutcome>(),
    purchaseId: uuid("purchase_id").references(() => purchases.id, { onDelete: "set null" }),
    error: text("error").$type<WebhookEventError>(),
  },
  (table) => [
    index("webhook_events_connection_id_received_at_idx").on(
      table.connectionId,
      table.receivedAt,
    ),
  ],
).enableRLS();

/**
 * The Stripe events of PULSACITY's own subscriptions, kept whole on arrival (the captures of lot 4.5), then processed
 * once: `processedAt` is the idempotency lock. One still unprocessed is replayed by the task of /api/cron/requests.
 */
export const stripeEvents = pgTable(
  "stripe_events",
  {
    id: text("id").primaryKey(),
    type: text("type").notNull(),
    payload: jsonb("payload"),
    receivedAt: timestamptz("received_at").defaultNow(),
    processedAt: timestamptz("processed_at"),
    error: text("error"),
  },
  (table) => [index("stripe_events_processed_at_received_at_idx").on(table.processedAt, table.receivedAt)],
).enableRLS();

/** Stripe's status of a subscription, as it says it: « active », « past_due », « canceled »… */
export type StripeSubscriptionStatus = string;

/**
 * A subscription of a space to PULSACITY, as Stripe last described it (rewritten from Stripe at each event, never
 * edited by hand). The space's plan follows it; spaces.stripe_subscription_id points to the current one.
 */
export const subscriptions = pgTable(
  "subscriptions",
  {
    /** Stripe's id of the subscription (sub_…). */
    id: text("id").primaryKey(),
    spaceId: uuid("space_id")
      .notNull()
      .references(() => spaces.id, { onDelete: "cascade" }),
    status: text("status").$type<StripeSubscriptionStatus>().notNull(),
    plan: planEnum("plan").notNull(),
    period: text("period").$type<BillingPeriod>().notNull(),
    priceList: text("price_list").$type<PriceList>().notNull(),
    amountCents: integer("amount_cents").notNull(),
    /** « Prochaine échéance »: when the paid period ends, and the next payment is due. */
    currentPeriodEnd: timestamptz("current_period_end"),
    /** A stop is programmed (« Votre plan Essentiel s'arrête le … »): the date it takes effect. */
    cancelAt: timestamptz("cancel_at"),
    endedAt: timestamptz("ended_at"),
    /** A change programmed for the end of the period (lower plan, other period): what comes next, and when. */
    scheduledPlan: planEnum("scheduled_plan"),
    scheduledPeriod: text("scheduled_period").$type<BillingPeriod>(),
    scheduledPriceList: text("scheduled_price_list").$type<PriceList>(),
    scheduledAmountCents: integer("scheduled_amount_cents"),
    scheduledAt: timestamptz("scheduled_at"),
    /** Subscribed with the beta testers' code: Essentiel offered until `betaUntil`, then the founder price. */
    betaTester: boolean("beta_tester").notNull().default(false),
    betaUntil: timestamptz("beta_until"),
    /** The e-mail sent 7 days before the first payment of a beta tester. */
    betaReminderSentAt: timestamptz("beta_reminder_sent_at"),
    /**
     * The end of the yearly period whose renewal was announced by e-mail, 7 days before (CGV 5.2): one e-mail per
     * renewal, claimed before it leaves.
     */
    renewalReminderPeriodEnd: timestamptz("renewal_reminder_period_end"),
    /**
     * The coupon of the promotion code typed at Checkout (« partenaire-… » for a partner's code), kept once the discount
     * is over: who brought the subscription.
     */
    couponId: text("coupon_id"),
    cardBrand: text("card_brand"),
    cardLast4: text("card_last4"),
    /** The last payment refused, while it stays unpaid: « Dernier paiement : … · refusé par votre banque ». */
    lastPaymentFailedAt: timestamptz("last_payment_failed_at"),
    lastPaymentFailedAmountCents: integer("last_payment_failed_amount_cents"),
    createdAt: timestamptz("created_at").notNull().defaultNow(),
    syncedAt: timestamptz("synced_at").notNull().defaultNow(),
  },
  (table) => [index("subscriptions_space_id_idx").on(table.spaceId)],
).enableRLS();

/**
 * The founder price is open to the first FOUNDER_PRICE_SEATS paying subscribers (plans.ts): one row per space that took
 * a seat, beta testers apart. A deleted space keeps its seat, without anything left to name it.
 */
export const founderSeats = pgTable("founder_seats", {
  id: uuid("id").primaryKey().defaultRandom(),
  spaceId: uuid("space_id")
    .unique()
    .references(() => spaces.id, { onDelete: "set null" }),
  takenAt: timestamptz("taken_at").notNull().defaultNow(),
}).enableRLS();

/**
 * Every invoice of PULSACITY paid by a space, for the threshold of the micro-entreprise (fin-v0/seuil-micro-entreprise.md):
 * paying clients, months in a row with a payment, total received. Billing records outlive a deleted space, anonymous.
 */
export const billingPayments = pgTable(
  "billing_payments",
  {
    /** Stripe's id of the invoice (in_…). */
    id: text("id").primaryKey(),
    spaceId: uuid("space_id").references(() => spaces.id, { onDelete: "set null" }),
    subscriptionId: text("subscription_id"),
    amountCents: integer("amount_cents").notNull(),
    currency: text("currency").notNull(),
    paidAt: timestamptz("paid_at").notNull(),
  },
  (table) => [index("billing_payments_paid_at_idx").on(table.paidAt)],
).enableRLS();

export const rateLimits = pgTable("rate_limits", {
  key: text("key").primaryKey(),
  hits: integer("hits").notNull(),
  windowStartedAt: timestamptz("window_started_at").notNull(),
}).enableRLS();
