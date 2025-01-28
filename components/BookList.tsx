import React from 'react'
import BookCard from './BookCard';
import BookOptions from './BookOptions';

interface Props {
    title: string;
    books: Book[];
    containerClassName?: string;
    userId: string;
    isReadingList: boolean;
}

const BookList = ({ title, books, containerClassName, userId, isReadingList }: Props) => {
  if (books.length < 2) return;

  return (
    <section className={containerClassName}>
        <h2 className='font-bebas-neue text-4xl text-light-100'>{title}</h2>

        <ul className='book-list'>
            {books.map((book) => (
                <BookOptions book={book} userId={userId} isReadingList={isReadingList} />
            ))}
        </ul>
    </section>
  )
}

export default BookList