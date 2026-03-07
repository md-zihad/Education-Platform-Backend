import { z } from "zod";

export const createResultSchema = z.object({
    studentId: z.string(),
    courseId: z.string(),
    score: z.number().min(0).max(1000),
    grade: z.string().max(5).optional(),
    academicYear: z.number(),
});

export const updateResultSchema = z.object({
    score: z.number().min(0).max(1000).optional(),
    grade: z.string().optional(),
    academicYear: z.number().optional(),
});

export const paginationSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
});