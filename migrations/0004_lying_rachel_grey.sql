CREATE TABLE "book_reads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"book_id" uuid,
	"user_id" uuid,
	"last_read_at" timestamp with time zone DEFAULT now(),
	"has_started" boolean DEFAULT false NOT NULL,
	"has_finished" boolean DEFAULT false NOT NULL,
	CONSTRAINT "book_reads_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "book_reads" ADD CONSTRAINT "book_reads_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_reads" ADD CONSTRAINT "book_reads_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;