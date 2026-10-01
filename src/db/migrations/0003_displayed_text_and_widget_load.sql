ALTER TABLE "testimonials" ADD COLUMN "display_body" text;--> statement-breakpoint
ALTER TABLE "testimonials" ADD COLUMN "display_edited_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "widgets" ADD COLUMN "first_loaded_at" timestamp with time zone;