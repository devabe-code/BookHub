import React from 'react';
import Image from 'next/image';
import BookCover from './BookCover';
import { db } from '@/database/drizzle';
import { eq } from 'drizzle-orm';
import { users, bookReads } from '@/database/schema';
import AddToLibrary from './AddToLibrary';
import ReadNow from './ReadNow';

interface Props extends Book {
  userId: string;
}

const BookOverview = async ({
  id,
  title,
  author,
  genre,
  rating,
  description,
  coverColor,
  coverUrl,
  userId,
}: Props) => {
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);

  if (!user) {
    return null;
  }

  return (
    <section className="book-overview">
      <div className="flex flex-1 flex-col gap-5">
        <h1>{title}</h1>

        <div className="book-info">
          <p>
            By <span className="font-semibold text-light-200">{author}</span>
          </p>

          <p>
            Category{' '}
            <span className="font-semibold text-light-200">{genre}</span>
          </p>

          <div className="flex flex-row gap-1">
            <Image src="/icons/star.svg" alt="star" width={22} height={22} />
            <p>{rating}</p>
          </div>
        </div>
        <p className="book-description">{description}</p>

        <div className="flex flex-row gap-2">
          <ReadNow bookId={id} userId={userId} />
          <AddToLibrary bookId={id} userId={userId} />
        </div>
      </div>

      <div className="relative flex flex-1 justify-center">
        <div className="relative">
          <BookCover
            variant="wide"
            className="z-10"
            coverColor={coverColor}
            coverImage={coverUrl}
          />

          <div className="absolute left-16 top-10 rotate-12 opacity-40 max-sm:hidden">
            <BookCover variant="wide" coverColor={coverColor} coverImage={coverUrl} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookOverview;