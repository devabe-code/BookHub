'use client'

import React from 'react'
import { Button } from './ui/button'
import { FaInfoCircle } from 'react-icons/fa'
import RemoveBook from './RemoveBook'
import BookCard from './BookCard'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const BookOptions = ({ book, userId, isReadingList }: { book: Book, userId: string, isReadingList: boolean }) => {
  // Return the name of the page the user is on
  const pathname = usePathname();

  return (
        <div
        className="relative group flex items-center transition-all duration-300"
    >
        {/* Book Card */}
        <div
        className="transform transition-transform duration-300 group-hover:translate-x-[-40px]"
        >
        <BookCard {...book} />
        </div>

        {/* Buttons that slide in */}
        <div
        className="absolute top-0 right-0 z-20 
                    translate-x-full opacity-0 
                    group-hover:translate-x-0 
                    group-hover:opacity-100 
                    flex flex-col justify-center 
                    items-center gap-2 transition-all duration-300"
        >
        {pathname === '/my-profile' && <RemoveBook book={book} bookId={book.id} userId={userId} isReadingList={isReadingList} />}
        <Link href={`/books/${book.id}`}>
            <Button className="text-sm flex items-center gap-2">
                <FaInfoCircle />
                Details
            </Button>
        </Link>
        </div>
    </div>
  )
}

export default BookOptions