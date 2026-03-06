import { z } from "zod";

export const createCourseSchema = z.object({
    name: z.string().min(2),
    code: z.string().min(2),
    credits: z.number().min(1).max(10).optional()
});

export const updateCourseSchema = z.object({
    name: z.string().optional(),
    code: z.string().optional(),
    credits: z.number().min(1).max(10).optional()
});

export const paginationSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
});