CREATE TABLE IF NOT EXISTS "roomie_account" (
	"user_id" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"provider_account_id" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT "roomie_account_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roomie_friend_request" (
	"id" serial PRIMARY KEY NOT NULL,
	"sender" varchar(255) NOT NULL,
	"recipient" varchar(255) NOT NULL,
	"status" "request_status" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roomie_friendship" (
	"user_one" varchar(255) NOT NULL,
	"user_two" varchar(255) NOT NULL,
	"friendshipStatus" "friendship_status" NOT NULL,
	CONSTRAINT "roomie_friendship_user_one_user_two_pk" PRIMARY KEY("user_one","user_two")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roomie_group_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"group_id" integer NOT NULL,
	"user_id" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roomie_groups_to_routines" (
	"group_id" integer,
	"routine_id" integer,
	CONSTRAINT "roomie_groups_to_routines_group_id_routine_id_pk" PRIMARY KEY("group_id","routine_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roomie_invitation" (
	"id" serial PRIMARY KEY NOT NULL,
	"group_id" integer NOT NULL,
	"sender_id" varchar NOT NULL,
	"recipient_id" varchar NOT NULL,
	"status" "request_status" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roomie_routine_groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"created_by" varchar NOT NULL,
	"color" char(6)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roomie_routine" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"interval_value" integer NOT NULL,
	"interval_unit" "interval_unit" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"reset_at" timestamp DEFAULT now() NOT NULL,
	"last_to_do_it" varchar,
	"assigned_to" varchar,
	"created_by" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roomie_session" (
	"session_token" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roomie_user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"email_verified" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"image" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roomie_verification_token" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "roomie_verification_token_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "roomie_account" ADD CONSTRAINT "roomie_account_user_id_roomie_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."roomie_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "roomie_friend_request" ADD CONSTRAINT "roomie_friend_request_sender_roomie_user_id_fk" FOREIGN KEY ("sender") REFERENCES "public"."roomie_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "roomie_friend_request" ADD CONSTRAINT "roomie_friend_request_recipient_roomie_user_id_fk" FOREIGN KEY ("recipient") REFERENCES "public"."roomie_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "roomie_friendship" ADD CONSTRAINT "roomie_friendship_user_one_roomie_user_id_fk" FOREIGN KEY ("user_one") REFERENCES "public"."roomie_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "roomie_friendship" ADD CONSTRAINT "roomie_friendship_user_two_roomie_user_id_fk" FOREIGN KEY ("user_two") REFERENCES "public"."roomie_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "roomie_group_users" ADD CONSTRAINT "roomie_group_users_group_id_roomie_routine_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."roomie_routine_groups"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "roomie_group_users" ADD CONSTRAINT "roomie_group_users_user_id_roomie_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."roomie_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "roomie_groups_to_routines" ADD CONSTRAINT "roomie_groups_to_routines_group_id_roomie_routine_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."roomie_routine_groups"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "roomie_groups_to_routines" ADD CONSTRAINT "roomie_groups_to_routines_routine_id_roomie_routine_id_fk" FOREIGN KEY ("routine_id") REFERENCES "public"."roomie_routine"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "roomie_invitation" ADD CONSTRAINT "roomie_invitation_group_id_roomie_routine_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."roomie_routine_groups"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "roomie_invitation" ADD CONSTRAINT "roomie_invitation_sender_id_roomie_user_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."roomie_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "roomie_invitation" ADD CONSTRAINT "roomie_invitation_recipient_id_roomie_user_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."roomie_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "roomie_routine_groups" ADD CONSTRAINT "roomie_routine_groups_created_by_roomie_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."roomie_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "roomie_routine" ADD CONSTRAINT "roomie_routine_last_to_do_it_roomie_user_id_fk" FOREIGN KEY ("last_to_do_it") REFERENCES "public"."roomie_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "roomie_routine" ADD CONSTRAINT "roomie_routine_assigned_to_roomie_user_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."roomie_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "roomie_routine" ADD CONSTRAINT "roomie_routine_created_by_roomie_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."roomie_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "roomie_session" ADD CONSTRAINT "roomie_session_user_id_roomie_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."roomie_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "account_user_id_idx" ON "roomie_account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_user_id_idx" ON "roomie_session" USING btree ("user_id");