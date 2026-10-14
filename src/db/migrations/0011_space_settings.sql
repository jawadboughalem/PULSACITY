ALTER TABLE "spaces" ADD COLUMN "sender_postal_address" text;--> statement-breakpoint
ALTER TABLE "spaces" ADD COLUMN "new_testimonial_email_enabled" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "spaces" ADD COLUMN "incentive_declared_at" timestamp with time zone;