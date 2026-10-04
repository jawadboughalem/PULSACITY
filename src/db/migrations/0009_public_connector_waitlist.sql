CREATE TABLE "connector_waitlist_emails" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"connector" text NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "connector_waitlist_emails_connector_email_unique" UNIQUE("connector","email")
);
--> statement-breakpoint
ALTER TABLE "connector_waitlist_emails" ENABLE ROW LEVEL SECURITY;