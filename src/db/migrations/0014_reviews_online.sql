CREATE TABLE "testimonial_corrections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"testimonial_id" uuid NOT NULL,
	"from_body" text NOT NULL,
	"body" text NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"sent_at" timestamp with time zone,
	"answered_at" timestamp with time zone,
	"outcome" text,
	CONSTRAINT "testimonial_corrections_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "testimonial_corrections" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "testimonials" ADD COLUMN "provenance" text;--> statement-breakpoint
ALTER TABLE "testimonials" ADD COLUMN "review_request_id" uuid;--> statement-breakpoint
ALTER TABLE "testimonials" ADD COLUMN "purchased_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "testimonials" ADD COLUMN "purchase_connector" text;--> statement-breakpoint
ALTER TABLE "testimonials" ADD COLUMN "hidden_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "testimonials" ADD COLUMN "hidden_reason" text;--> statement-breakpoint
ALTER TABLE "testimonials" ADD COLUMN "hidden_reason_detail" text;--> statement-breakpoint
ALTER TABLE "testimonials" ADD COLUMN "hidden_reason_sent_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "testimonial_corrections" ADD CONSTRAINT "testimonial_corrections_testimonial_id_testimonials_id_fk" FOREIGN KEY ("testimonial_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "testimonial_corrections_testimonial_id_idx" ON "testimonial_corrections" USING btree ("testimonial_id");--> statement-breakpoint
CREATE UNIQUE INDEX "testimonial_corrections_one_waiting_unique" ON "testimonial_corrections" USING btree ("testimonial_id") WHERE "testimonial_corrections"."outcome" is null;--> statement-breakpoint
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_review_request_id_review_requests_id_fk" FOREIGN KEY ("review_request_id") REFERENCES "public"."review_requests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
UPDATE "testimonials" SET "provenance" = CASE "source" WHEN 'manual' THEN 'added' WHEN 'csv' THEN 'import' ELSE 'public-link' END WHERE "provenance" IS NULL;--> statement-breakpoint
UPDATE "testimonials" AS "testimonial" SET
	"provenance" = CASE WHEN "origin"."source" = 'connector' THEN 'sale' ELSE 'request' END,
	"review_request_id" = "origin"."review_request_id",
	"purchased_at" = "origin"."purchased_at",
	"purchase_connector" = "origin"."connector"
FROM (
	SELECT DISTINCT ON ("answered"."id") "answered"."id" AS "testimonial_id", "review_requests"."id" AS "review_request_id",
		"purchases"."source", "purchases"."purchased_at", "connections"."connector"
	FROM "testimonials" AS "answered"
	INNER JOIN "purchases" ON "purchases"."space_id" = "answered"."space_id"
		AND "purchases"."customer_id" = "answered"."customer_id"
		AND "purchases"."product_id" = "answered"."product_id"
	INNER JOIN "review_requests" ON "review_requests"."purchase_id" = "purchases"."id" AND "review_requests"."status" = 'completed'
	LEFT JOIN "connections" ON "connections"."id" = "purchases"."connection_id"
	WHERE "answered"."source" = 'form'
	ORDER BY "answered"."id", "review_requests"."completed_at" DESC
) AS "origin"
WHERE "testimonial"."id" = "origin"."testimonial_id";
