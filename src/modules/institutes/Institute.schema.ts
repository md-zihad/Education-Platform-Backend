import { z } from "zod";

export const instituteSchema = z.object({
    name: z.string().min(2),
    establishedYear: z.number().int().min(1800).max(new Date().getFullYear()),
    city: z.string().optional(),
    country: z.string().optional(),
});

// Query params validation for pagination
export const paginationSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
});