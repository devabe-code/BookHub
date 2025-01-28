ALTER TABLE "books" ALTER COLUMN "rating" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "author_photo_url" text NOT NULL;--> statement-breakpoint
ALTER TABLE "books" DROP COLUMN "summary";