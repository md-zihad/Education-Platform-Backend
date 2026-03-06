import { z } from "zod";

export const studentSchema = z.object({
    name: z.string().min(2),
    email: z.email(),
    age: z.number().optional(),
    gender: z.string().optional(),
    instituteId: z.string(),
    enrollmentYear: z.number().optional(),
});


export const paginationSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
});