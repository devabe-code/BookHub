import { auth } from "@/auth";
import BookList from "@/components/BookList";
import BookOverview from "@/components/BookOverview";
import LastReadBooks from "@/components/LastReadBooks";
import { db } from "@/database/drizzle";
import { bookReads, books, users } from "@/database/schema";
import { desc, eq } from "drizzle-orm";

const Home = async () =>  {
  const session = await auth();

  const latestBooks = (await db.select().from(books).limit(10).orderBy(desc(books.createdAt))) as Book[];

  const userReads = await db.select().from(bookReads).where(eq(bookReads.userId, session?.user?.id as string));
  return (
    <>
    <BookOverview
      {...latestBooks[0] }
      userId={session?.user?.id as string}
    />

    {session?.user?.id && userReads.length > 0 && (
      <LastReadBooks userReads={userReads} session={session} />
    )}

      <BookList 
        title="Latest Books"
        books={latestBooks.slice(1)}
        containerClassName="mt-28"
        userId={session?.user?.id as string}
        isReadingList={false}
      />
    </>

  );
}

export default Home;