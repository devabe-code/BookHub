import { z } from "zod";

export const signUpSchema = z.object(
    {
        fullName: z.string().min(3),
        email: z.string().email(),
        password: z.string().min(8),
        profilePicture: z.string().optional().default('')
    }
);

export const signInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
})

export const bookSchema = z.object({
    title: z.string().trim().min(2).max(100),
    genre: z.string().trim().min(2).max(50),
    author: z.string().min(3).max(50),
    rating: z.number().min(1).max(5),
    totalCopies: z.coerce.number().int().positive().lte(1000),
    description: z.string().min(10).max(1000),
    coverUrl: z.string().nonempty(),
    coverColor: z.string().trim().regex(/^#([0-9a-fA-F]{6})$/),
    videoUrl: z.string().nonempty(),
    summary: z.string().trim().min(10),
})