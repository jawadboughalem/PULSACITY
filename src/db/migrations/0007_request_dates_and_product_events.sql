ALTER TABLE "external_products" ADD COLUMN "event_type" text;--> statement-breakpoint
ALTER TABLE "review_requests" ADD COLUMN "cancelled_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "review_requests" ADD COLUMN "failed_at" timestamp with time zone;