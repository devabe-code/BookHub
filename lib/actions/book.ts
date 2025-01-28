"use server"

import { and, eq } from "drizzle-orm";
import { db } from "@/database/drizzle";
import { bookLibrary, bookReads, books, users } from "@/database/schema";

export const bookRead = async (params: BookReadParams) => {
    const { bookId, userId, readAt, hasStarted, hasFinished } = params;

    try {
        const existingRecord = await db
            .select()
            .from(bookReads)
            .where(and(eq(bookReads.bookId, bookId), eq(bookReads.userId, userId)))
            .limit(1);
    
        if (existingRecord.length) {
            await db
            .update(bookReads)
            .set({ hasStarted: true, lastReadAt: new Date() })
            .where(and(eq(bookReads.bookId, bookId), eq(bookReads.userId, userId)));
        } else {
            await db.insert(bookReads).values({
            bookId: bookId,
            userId: userId,
            hasStarted: true,
            hasFinished: false,
            lastReadAt: new Date(),
            });
        }

            const record = await db.select().from(bookReads).where(and(eq(bookReads.bookId, bookId), eq(bookReads.userId, userId))).limit(1);

        return {
            success: true,
            data: JSON.parse(JSON.stringify(record))
        } 
    } catch (error) {
        console.log(error);

        return {
            success: false,
            error: "Failed to update book read status"
        }
    }
}

export const bookAddToLibrary = async (params: BookAddToLibraryParams) => {
    const { bookId, userId } = params;

    try {
        // Check if book is already in library
        const existingRecord = await db
        .select()
        .from(bookLibrary)
        .where(and(eq(bookLibrary.bookId, bookId), eq(bookLibrary.userId, userId)))
        .limit(1);

        if (!existingRecord.length) {
            await db.insert(bookLibrary).values({
              bookId: bookId,
              userId: userId,
            });
            return {
                success: true,
                data: JSON.parse(JSON.stringify(existingRecord))
            }
        } else {
            return {
                success: false,
                error: "Book already in library"
            }
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            error: "Failed to add book to library"
        }
    }
}

export const bookRemoveFromLibrary = async (bookId: string, userId: string, isReadingList: boolean) => {
    // Check if user is removing from their library or reading list
    try {
        if(isReadingList) {
            await db.delete(bookReads).where(and(eq(bookReads.bookId, bookId), eq(bookReads.userId, userId)));
        } else {
            await db.delete(bookLibrary).where(and(eq(bookLibrary.bookId, bookId), eq(bookLibrary.userId, userId)));
        }
        return {
            success: true,
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            error: "Failed to remove book."
        }
    }
}