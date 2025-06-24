import { University } from 'lucide-react';
import { z } from 'zod';
// This file contains validation schemas using Zod for various forms in the application.

/* using zod from components -----> ui -----> form {all of shadcn} */

export const signUpSchema = z.object({
    fullName: z.string().min(3),
    email: z.string().email(),
    universityId: z.coerce.number(),
    universityCard: z.string().nonempty("University card is required"),
    password: z.string().min(8),
});

export const signInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
})


/* defining schema for 
(auth)
    sign in 
        page
    sign Up 
        page

 */

//now for the admin as new books addition

export const bookSchema = z.object( {
    title: z.string().trim().min(2).max(100),
    description: z.string().trim().min(10).max(1000),
    author: z.string().trim().min(2).max(100),
    genre: z.string().trim().min(2).max(50),
    rating: z.number().min(1).max(5),
    totalCopies: z.coerce.number().int().positive().lte(10000),
    coverUrl: z.string().nonempty(),
    coverColor: z.string().trim().regex(/^#[0-9A-F]{6}$/i),
    videoUrl: z.string().nonempty(),
    summary: z.string().trim().min(10)
})

//corece means we need to convert to int in number
//lte --> lower than