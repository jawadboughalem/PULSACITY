CREATE TABLE "referrals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"referrer_space_id" uuid NOT NULL,
	"referee_space_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"rewarded_at" timestamp with time zone,
	"reward" text,
	"reward_invoice_id" text,
	CONSTRAINT "referrals_referee_space_id_unique" UNIQUE("referee_space_id")
);
--> statement-breakpoint
ALTER TABLE "referrals" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "space_acquisitions" (
	"space_id" uuid PRIMARY KEY NOT NULL,
	"heard_from" text,
	"utm_source" text,
	"utm_medium" text,
	"utm_campaign" text,
	"utm_content" text,
	"utm_term" text,
	"referral_code" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "space_acquisitions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "welcome_emails" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"space_id" uuid NOT NULL,
	"step" text NOT NULL,
	"claimed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"sent_at" timestamp with time zone,
	"skipped_at" timestamp with time zone,
	CONSTRAINT "welcome_emails_space_id_step_unique" UNIQUE("space_id","step")
);
--> statement-breakpoint
ALTER TABLE "welcome_emails" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "spaces" ADD COLUMN "welcome_emails_unsubscribed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "spaces" ADD COLUMN "referral_essentiel_until" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "coupon_id" text;--> statement-breakpoint
ALTER TABLE "widgets" ADD COLUMN "last_loaded_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referrer_space_id_spaces_id_fk" FOREIGN KEY ("referrer_space_id") REFERENCES "public"."spaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referee_space_id_spaces_id_fk" FOREIGN KEY ("referee_space_id") REFERENCES "public"."spaces"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "space_acquisitions" ADD CONSTRAINT "space_acquisitions_space_id_spaces_id_fk" FOREIGN KEY ("space_id") REFERENCES "public"."spaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "welcome_emails" ADD CONSTRAINT "welcome_emails_space_id_spaces_id_fk" FOREIGN KEY ("space_id") REFERENCES "public"."spaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "referrals_referrer_space_id_idx" ON "referrals" USING btree ("referrer_space_id");