ALTER TABLE "users" ADD COLUMN "is_gmail_connected" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_calendar_connected" boolean DEFAULT false NOT NULL;