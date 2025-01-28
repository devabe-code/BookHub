import Link from 'next/link';
import React from 'react'
import BookCover from './BookCover';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

const BookCard = ({ id, title, genre, coverColor, coverUrl}: Book) => 
<li className={"xs:w-52 w-full"}>
    <Link href={`/books/${id}`} className={'w-full flex flex-col items-center'}>
        <BookCover coverColor={coverColor} coverImage={coverUrl} />

        <div className={`mt-4 xs:max-w-40 max-w-28`}>
            <p className='book-title'>{title}</p>
            <p className='book-genre'>{genre}</p>
        </div>
    </Link>
</li>;

export default BookCard