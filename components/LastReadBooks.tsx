import { eq } from 'drizzle-orm';
import { db } from '@/database/drizzle';
import React from 'react'
import BookOptions from './BookOptions';
import { books } from '@/database/schema';

const LastReadBooks = ({ userReads, session }: { userReads: any, session: any }) => {
  return (
    <section className='last_read-section mt-10'>
        <h1 className='text-4xl font-bebas-neue text-light-100'>Pick Up Where You Left Off</h1>
        <div className='mt-4 flex flex-row flex-wrap gap-8'>
        {userReads.map(async (book : any) => {
            const bookData = await db.select().from(books).where(eq(books.id, book.bookId as string));
            return (
                <BookOptions key={bookData[0].id} book={bookData[0]} userId={session?.user?.id as string} isReadingList={true} />
            )
        })}
        </div>
    </section>
  )
}

export default LastReadBooks