CREATE TYPE "public"."domain_type" AS ENUM('corporate', 'demo', 'client');--> statement-breakpoint
CREATE TYPE "public"."lead_status" AS ENUM('new', 'contacted', 'converted', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('paid');--> statement-breakpoint
CREATE TYPE "public"."site_status" AS ENUM('demo', 'sold', 'live', 'archived');--> statement-breakpoint
CREATE TYPE "public"."vat_mode" AS ENUM('franchise', 'standard');--> statement-breakpoint
CREATE TABLE "domains" (
	"host" text PRIMARY KEY NOT NULL,
	"tenant_id" uuid,
	"type" "domain_type" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_name" text NOT NULL,
	"city" text,
	"phone_e164" text NOT NULL,
	"email" text,
	"source" text NOT NULL,
	"status" "lead_status" DEFAULT 'new' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"stripe_session_id" text NOT NULL,
	"payment_intent_id" text,
	"amount_total_cents" integer NOT NULL,
	"currency" text NOT NULL,
	"customer_email" text,
	"customer_phone" text,
	"business_name" text,
	"city" text,
	"site_id" uuid,
	"vat_mode" "vat_mode" NOT NULL,
	"status" "order_status" DEFAULT 'paid' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"city" text,
	"block" text,
	"status" "site_status" DEFAULT 'demo' NOT NULL,
	"content" jsonb NOT NULL,
	"expires_at" timestamp with time zone,
	"sold_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stripe_events" (
	"id" text PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"received_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "leads_created_at_idx" ON "leads" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "orders_stripe_session_id_key" ON "orders" USING btree ("stripe_session_id");--> statement-breakpoint
CREATE UNIQUE INDEX "sites_slug_key" ON "sites" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "sites_status_idx" ON "sites" USING btree ("status");