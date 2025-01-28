import { auth, signOut } from '@/auth';
import BookCard from '@/components/BookCard';
import BookOptions from '@/components/BookOptions';
import LastReadBooks from '@/components/LastReadBooks';
import RemoveBook from '@/components/RemoveBook';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { db } from '@/database/drizzle';
import { bookLibrary, bookReads, books } from '@/database/schema';
import { eq } from 'drizzle-orm';
import { OptionIcon } from 'lucide-react';
import React from 'react'
import { FaExpand, FaInfo, FaInfoCircle, FaOptinMonster, FaRemoveFormat, FaTrash, FaWindowClose } from 'react-icons/fa';


const Page = async () => {
  const session = await auth();

  // Fetch all books in user's library from bookLibrary table
  const userBooks = await db.select().from(bookLibrary).where(eq(bookLibrary.userId, session?.user?.id as string));

  // Fetch all books in user's reads from bookReads table
  const userReads = await db.select().from(bookReads).where(eq(bookReads.userId, session?.user?.id as string));

  return (
    <>
        <form action={async () => {
            'use server';
            await signOut();
        }}
        className='mb-10'>
            <Button>Logout</Button>
        </form>

        <LastReadBooks userReads={userReads} session={session} />

        <section className="library-section mt-10">
          <h1 className="text-4xl font-bebas-neue text-light-100">My Library</h1>
          <div className="flex flex-row flex-wrap gap-8">
            {userBooks.map(async (book) => {
              const bookData = await db.select().from(books).where(eq(books.id, book.bookId as string));
              return (
                <BookOptions book={bookData[0]} userId={session?.user?.id as string} isReadingList={false} />
              );
            })}
          </div>
        </section>

    </>
  )
}

export default Page