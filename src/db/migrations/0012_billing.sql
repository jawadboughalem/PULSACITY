CREATE TABLE "billing_payments" (
	"id" text PRIMARY KEY NOT NULL,
	"space_id" uuid,
	"subscription_id" text,
	"amount_cents" integer NOT NULL,
	"currency" text NOT NULL,
	"paid_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "billing_payments" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "founder_seats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"space_id" uuid,
	"taken_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "founder_seats_space_id_unique" UNIQUE("space_id")
);
--> statement-breakpoint
ALTER TABLE "founder_seats" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" text PRIMARY KEY NOT NULL,
	"space_id" uuid NOT NULL,
	"status" text NOT NULL,
	"plan" "plan" NOT NULL,
	"period" text NOT NULL,
	"price_list" text NOT NULL,
	"amount_cents" integer NOT NULL,
	"current_period_end" timestamp with time zone,
	"cancel_at" timestamp with time zone,
	"ended_at" timestamp with time zone,
	"scheduled_plan" "plan",
	"scheduled_period" text,
	"scheduled_price_list" text,
	"scheduled_amount_cents" integer,
	"scheduled_at" timestamp with time zone,
	"beta_tester" boolean DEFAULT false NOT NULL,
	"beta_until" timestamp with time zone,
	"beta_reminder_sent_at" timestamp with time zone,
	"card_brand" text,
	"card_last4" text,
	"last_payment_failed_at" timestamp with time zone,
	"last_payment_failed_amount_cents" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"synced_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "subscriptions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "stripe_events" ALTER COLUMN "processed_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "stripe_events" ALTER COLUMN "processed_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "spaces" ADD COLUMN "free_since" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "stripe_events" ADD COLUMN "payload" jsonb;--> statement-breakpoint
ALTER TABLE "stripe_events" ADD COLUMN "received_at" timestamp with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "stripe_events" ADD COLUMN "error" text;--> statement-breakpoint
ALTER TABLE "widgets" ADD COLUMN "free_plan_chosen_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "billing_payments" ADD CONSTRAINT "billing_payments_space_id_spaces_id_fk" FOREIGN KEY ("space_id") REFERENCES "public"."spaces"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "founder_seats" ADD CONSTRAINT "founder_seats_space_id_spaces_id_fk" FOREIGN KEY ("space_id") REFERENCES "public"."spaces"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_space_id_spaces_id_fk" FOREIGN KEY ("space_id") REFERENCES "public"."spaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "billing_payments_paid_at_idx" ON "billing_payments" USING btree ("paid_at");--> statement-breakpoint
CREATE INDEX "subscriptions_space_id_idx" ON "subscriptions" USING btree ("space_id");--> statement-breakpoint
CREATE INDEX "stripe_events_processed_at_received_at_idx" ON "stripe_events" USING btree ("processed_at","received_at");