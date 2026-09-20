CREATE TYPE "public"."lead_kind" AS ENUM('order_brief', 'notify', 'contact');--> statement-breakpoint
ALTER TABLE "leads" ALTER COLUMN "business_name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "leads" ALTER COLUMN "phone_e164" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "kind" "lead_kind" NOT NULL;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "line_slug" text;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "payload" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "converted_order_id" uuid;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "offer_slug" text NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "lead_id" uuid;--> statement-breakpoint
CREATE INDEX "leads_kind_idx" ON "leads" USING btree ("kind");--> statement-breakpoint
ALTER TABLE "leads" DROP COLUMN "source";