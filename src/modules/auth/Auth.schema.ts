import { z } from "zod";

export const signupSchema = z.object({

    email: z.string({
        error: (iss) => iss.input === undefined ? "Field is required." : "Invalid input."
    }).trim().pipe(z.email()),

    password: z.string().min(8, {
        error: (iss) => {
            iss.minimum;
            return `Password must be at least ${iss.minimum} characters long`;
        }
    }),
});