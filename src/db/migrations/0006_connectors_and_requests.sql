CREATE TABLE "connector_waitlist" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"space_id" uuid NOT NULL,
	"connector" text NOT NULL,
	"tool_name" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "connector_waitlist_space_id_connector_tool_name_unique" UNIQUE NULLS NOT DISTINCT("space_id","connector","tool_name")
);
--> statement-breakpoint
ALTER TABLE "connector_waitlist" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "external_products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"connection_id" uuid NOT NULL,
	"external_ref" text NOT NULL,
	"name" text NOT NULL,
	"price_cents" integer,
	"currency" text,
	"first_seen_at" timestamp with time zone NOT NULL,
	CONSTRAINT "external_products_connection_id_external_ref_unique" UNIQUE("connection_id","external_ref")
);
--> statement-breakpoint
ALTER TABLE "external_products" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "review_requests" ADD COLUMN "failed_attempts" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "webhook_events" ADD COLUMN "raw_body" text;--> statement-breakpoint
ALTER TABLE "webhook_events" ADD COLUMN "outcome" text;--> statement-breakpoint
ALTER TABLE "webhook_events" ADD COLUMN "purchase_id" uuid;--> statement-breakpoint
ALTER TABLE "connector_waitlist" ADD CONSTRAINT "connector_waitlist_space_id_spaces_id_fk" FOREIGN KEY ("space_id") REFERENCES "public"."spaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "external_products" ADD CONSTRAINT "external_products_connection_id_connections_id_fk" FOREIGN KEY ("connection_id") REFERENCES "public"."connections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "webhook_events" ADD CONSTRAINT "webhook_events_purchase_id_purchases_id_fk" FOREIGN KEY ("purchase_id") REFERENCES "public"."purchases"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "connections" ADD CONSTRAINT "connections_space_id_connector_unique" UNIQUE("space_id","connector");--> statement-breakpoint
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_connection_id_external_ref_unique" UNIQUE("connection_id","external_ref");