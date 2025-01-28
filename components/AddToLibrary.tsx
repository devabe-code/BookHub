'use client'

import React, { useState } from 'react'
import { Button } from './ui/button'
import { FaHeart } from 'react-icons/fa'
import { toast } from '@/hooks/use-toast';
import { db } from '@/database/drizzle';
import { bookLibrary } from '@/database/schema';
import { and, eq } from 'drizzle-orm';
import { useRouter } from 'next/navigation';
import { bookAddToLibrary } from '@/lib/actions/book';

const AddToLibrary = ({ bookId, userId }: { bookId: string, userId: string }) => {
    const router = useRouter();

    const handleAddToLibrary = async () => {
        try {
            const result = await bookAddToLibrary({ bookId, userId });
            if (result.success) {
                toast({
                    title: 'Book added to your library!',
                    description: 'You can now read the book.',
                });
                router.push('/my-profile');
            } else {
                toast({
                    title: 'Book already in your library!',
                    description: 'An error occurred while adding book to library.',
                    variant: 'destructive',
                  });
            }
          } catch (error) {
          console.error('Error adding book to library:', error);
          toast({
            title: 'Error',
            description: 'An error occurred while adding book to library.',
          });
        }
      };    

  return (
    <Button className="book-overview_btn" onClick={handleAddToLibrary}>
        <FaHeart className="w-5 h-5" />
        <p className="font-bebas-neue text-xl text-dark-100">Add to Library</p>
    </Button>
  )
}

export default AddToLibrary