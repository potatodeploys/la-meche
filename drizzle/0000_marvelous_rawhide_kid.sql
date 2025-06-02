CREATE TABLE IF NOT EXISTS "preorders" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"preferred_scent" varchar(100),
	"phone" varchar(50),
	"address" text,
	"newsletter" boolean DEFAULT false,
	"discount_code" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "preorders_email_unique" UNIQUE("email"),
	CONSTRAINT "preorders_discount_code_unique" UNIQUE("discount_code")
);
