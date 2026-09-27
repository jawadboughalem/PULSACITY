CREATE TYPE "public"."connection_status" AS ENUM('pending', 'active', 'error');--> statement-breakpoint
CREATE TYPE "public"."plan" AS ENUM('free', 'essentiel', 'pro');--> statement-breakpoint
CREATE TYPE "public"."purchase_source" AS ENUM('connector', 'manual', 'csv');--> statement-breakpoint
CREATE TYPE "public"."review_request_status" AS ENUM('scheduled', 'sent', 'reminded', 'completed', 'cancelled', 'failed');--> statement-breakpoint
CREATE TYPE "public"."testimonial_source" AS ENUM('form', 'manual', 'csv');--> statement-breakpoint
CREATE TYPE "public"."testimonial_status" AS ENUM('pending', 'approved', 'hidden');--> statement-breakpoint
CREATE TYPE "public"."widget_type" AS ENUM('wall', 'carousel', 'badge');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp with time zone,
	"refresh_token_expires_at" timestamp with time zone,
	"scope" text,
	"password" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "connections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"space_id" uuid NOT NULL,
	"connector" text NOT NULL,
	"webhook_token" text NOT NULL,
	"status" "connection_status" DEFAULT 'pending' NOT NULL,
	"last_event_at" timestamp with time zone,
	"config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "connections_webhook_token_unique" UNIQUE("webhook_token")
);
--> statement-breakpoint
CREATE TABLE "customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"space_id" uuid NOT NULL,
	"email" text NOT NULL,
	"first_name" text,
	"last_name" text,
	"unsubscribed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "customers_space_id_email_unique" UNIQUE("space_id","email"),
	CONSTRAINT "customers_email_lowercase_check" CHECK ("customers"."email" = lower("customers"."email"))
);
--> statement-breakpoint
CREATE TABLE "product_refs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"connection_id" uuid NOT NULL,
	"external_ref" text NOT NULL,
	CONSTRAINT "product_refs_connection_id_external_ref_unique" UNIQUE("connection_id","external_ref")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"space_id" uuid NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"request_delay_days" integer DEFAULT 14 NOT NULL,
	"requests_enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "products_space_id_slug_unique" UNIQUE("space_id","slug")
);
--> statement-breakpoint
CREATE TABLE "purchases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"space_id" uuid NOT NULL,
	"customer_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"connection_id" uuid,
	"source" "purchase_source" NOT NULL,
	"event_type" text,
	"external_ref" text,
	"purchased_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "review_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"purchase_id" uuid NOT NULL,
	"token" text NOT NULL,
	"scheduled_at" timestamp with time zone NOT NULL,
	"sent_at" timestamp with time zone,
	"reminder_scheduled_at" timestamp with time zone,
	"reminder_sent_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"status" "review_request_status" DEFAULT 'scheduled' NOT NULL,
	CONSTRAINT "review_requests_purchase_id_unique" UNIQUE("purchase_id"),
	CONSTRAINT "review_requests_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "spaces" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"logo_url" text,
	"accent_color" text,
	"reply_to_email" text NOT NULL,
	"plan" "plan" DEFAULT 'free' NOT NULL,
	"stripe_customer_id" text,
	"stripe_subscription_id" text,
	"referral_code" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "spaces_slug_unique" UNIQUE("slug"),
	CONSTRAINT "spaces_stripe_customer_id_unique" UNIQUE("stripe_customer_id"),
	CONSTRAINT "spaces_stripe_subscription_id_unique" UNIQUE("stripe_subscription_id"),
	CONSTRAINT "spaces_referral_code_unique" UNIQUE("referral_code")
);
--> statement-breakpoint
CREATE TABLE "stripe_events" (
	"id" text PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"processed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"space_id" uuid NOT NULL,
	"product_id" uuid,
	"customer_id" uuid,
	"author_name" text NOT NULL,
	"author_title" text,
	"author_photo_url" text,
	"rating" smallint NOT NULL,
	"body" text NOT NULL,
	"status" "testimonial_status" DEFAULT 'pending' NOT NULL,
	"source" "testimonial_source" NOT NULL,
	"consent_at" timestamp with time zone,
	"consent_text" text,
	"featured" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "testimonials_rating_check" CHECK ("testimonials"."rating" between 1 and 5),
	CONSTRAINT "testimonials_form_consent_check" CHECK ("testimonials"."source" <> 'form' or ("testimonials"."consent_at" is not null and "testimonials"."consent_text" is not null))
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "webhook_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"connection_id" uuid NOT NULL,
	"raw_payload" jsonb NOT NULL,
	"headers" jsonb NOT NULL,
	"event_type" text,
	"received_at" timestamp with time zone DEFAULT now() NOT NULL,
	"processed_at" timestamp with time zone,
	"error" text
);
--> statement-breakpoint
CREATE TABLE "widgets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"space_id" uuid NOT NULL,
	"type" "widget_type" NOT NULL,
	"product_id" uuid,
	"settings" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "connections" ADD CONSTRAINT "connections_space_id_spaces_id_fk" FOREIGN KEY ("space_id") REFERENCES "public"."spaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_space_id_spaces_id_fk" FOREIGN KEY ("space_id") REFERENCES "public"."spaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_refs" ADD CONSTRAINT "product_refs_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_refs" ADD CONSTRAINT "product_refs_connection_id_connections_id_fk" FOREIGN KEY ("connection_id") REFERENCES "public"."connections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_space_id_spaces_id_fk" FOREIGN KEY ("space_id") REFERENCES "public"."spaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_space_id_spaces_id_fk" FOREIGN KEY ("space_id") REFERENCES "public"."spaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_connection_id_connections_id_fk" FOREIGN KEY ("connection_id") REFERENCES "public"."connections"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_requests" ADD CONSTRAINT "review_requests_purchase_id_purchases_id_fk" FOREIGN KEY ("purchase_id") REFERENCES "public"."purchases"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "spaces" ADD CONSTRAINT "spaces_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_space_id_spaces_id_fk" FOREIGN KEY ("space_id") REFERENCES "public"."spaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "webhook_events" ADD CONSTRAINT "webhook_events_connection_id_connections_id_fk" FOREIGN KEY ("connection_id") REFERENCES "public"."connections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "widgets" ADD CONSTRAINT "widgets_space_id_spaces_id_fk" FOREIGN KEY ("space_id") REFERENCES "public"."spaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "widgets" ADD CONSTRAINT "widgets_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "connections_space_id_idx" ON "connections" USING btree ("space_id");--> statement-breakpoint
CREATE INDEX "product_refs_product_id_idx" ON "product_refs" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "purchases_space_id_idx" ON "purchases" USING btree ("space_id");--> statement-breakpoint
CREATE INDEX "purchases_customer_id_product_id_idx" ON "purchases" USING btree ("customer_id","product_id");--> statement-breakpoint
CREATE INDEX "purchases_product_id_idx" ON "purchases" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "purchases_connection_id_idx" ON "purchases" USING btree ("connection_id");--> statement-breakpoint
CREATE INDEX "review_requests_status_scheduled_at_idx" ON "review_requests" USING btree ("status","scheduled_at");--> statement-breakpoint
CREATE INDEX "review_requests_status_reminder_scheduled_at_idx" ON "review_requests" USING btree ("status","reminder_scheduled_at");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "spaces_user_id_idx" ON "spaces" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "testimonials_space_id_status_idx" ON "testimonials" USING btree ("space_id","status");--> statement-breakpoint
CREATE INDEX "testimonials_product_id_idx" ON "testimonials" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "testimonials_customer_id_idx" ON "testimonials" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "webhook_events_connection_id_received_at_idx" ON "webhook_events" USING btree ("connection_id","received_at");--> statement-breakpoint
CREATE INDEX "widgets_space_id_idx" ON "widgets" USING btree ("space_id");