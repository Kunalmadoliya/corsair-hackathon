CREATE TABLE "analytics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"date" timestamp with time zone DEFAULT now() NOT NULL,
	"emails_read" text DEFAULT '0' NOT NULL,
	"emails_sent" text DEFAULT '0' NOT NULL,
	"events_created" text DEFAULT '0' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_demo_mode" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "analytics" ADD CONSTRAINT "analytics_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;