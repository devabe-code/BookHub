'use client'

import React from 'react'
import { Button } from './ui/button'
import Image from 'next/image'
import { toast } from '@/hooks/use-toast';
import { db } from '@/database/drizzle';
import { bookReads } from '@/database/schema';
import { and, eq } from 'drizzle-orm';
import { bookRead } from '@/lib/actions/book';

const ReadNow = ({bookId, userId}: {bookId: string, userId: string}) => {
    const handleReadNow = async () => {
        try {
            await bookRead({ bookId, userId, readAt: new Date(), hasStarted: true, hasFinished: false });
    
          toast({
            title: 'Enjoy your reading!',
            description: 'You can now read the book.',
          });
        } catch (error) {
          console.error('Error starting book reading:', error);
          toast({
            title: 'Error',
            description: 'An error occurred while starting book reading.',
          });
        }
      };
      
  return (
    <Button className="book-overview_btn" onClick={handleReadNow}>
        <Image src="/icons/book.svg" alt="book" width={20} height={20} />
        <p className="font-bebas-neue text-xl text-dark-100">Read Now</p>
  </Button>
  )
}

export default ReadNow