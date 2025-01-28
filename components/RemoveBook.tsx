import React from 'react';
import { Button } from './ui/button';
import { FaTrash } from 'react-icons/fa';
import { bookRemoveFromLibrary } from '@/lib/actions/book';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
const RemoveBook = ({ book, bookId, userId, isReadingList }: 
    { book: Book, bookId: string, userId: string, isReadingList: boolean }) => {

    const router = useRouter();
    const handleRemove = async () => {
        try {
            const result = await bookRemoveFromLibrary(bookId, userId, isReadingList);
            if(result.success) {
                toast({
                    title: "Book removed!",
                    description: `${book.title} has been removed from your ${isReadingList ? "reading list" : "library"}.`,
                });
                router.refresh();
            } else {
                toast({
                    title: "Failed to remove book",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error(error);
            toast({
                title: "Failed to remove book",
                variant: "destructive",
            });
        }
    }
  return (
    <Button
      className="p-2 text-sm flex items-center"
      title="Remove from Library"
      variant="destructive"
      onClick={handleRemove}
    >
      <FaTrash className="text-dark-100" />
      Remove
    </Button>
  );
};

export default RemoveBook;