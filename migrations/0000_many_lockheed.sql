CREATE TABLE IF NOT EXISTS "roomie_routines" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"interval_value" integer NOT NULL,
	"interval_unit" "interval_unit" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_to_do_it" integer NOT NULL,
	"assigned_to" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roomie_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	CONSTRAINT "roomie_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "roomie_routines" ADD CONSTRAINT "roomie_routines_last_to_do_it_roomie_users_id_fk" FOREIGN KEY ("last_to_do_it") REFERENCES "public"."roomie_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "roomie_routines" ADD CONSTRAINT "roomie_routines_assigned_to_roomie_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."roomie_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
