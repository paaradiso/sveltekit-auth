CREATE TABLE IF NOT EXISTS "email_verification_token" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar,
	"expires_at" timestamp DEFAULT now() + interval '24 hours'
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "email_verification_token" ADD CONSTRAINT "email_verification_token_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
