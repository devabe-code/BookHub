CREATE TABLE "book_library" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"book_id" uuid,
	"user_id" uuid,
	CONSTRAINT "book_library_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "book_library" ADD CONSTRAINT "book_library_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_library" ADD CONSTRAINT "book_library_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;