import { Request, Response, NextFunction } from "express";
import { ZodType, ZodError, ZodIssue } from "zod";

type RequestPart = "body" | "query" | "params";

export const validate = (schema: ZodType<any>, source: RequestPart = "body") =>
    (req: Request, res: Response, next: NextFunction) => {

        try {
            const data = req[source];
            const parsed = schema.parse(data);

            req[source] = parsed;

            next();

        } catch (err: unknown) {

            if (err instanceof ZodError) {

                return res.status(400).json(
                    {
                        message: "Validation failed",
                        errors: err.issues.map((issue: ZodIssue) => (
                            {
                                field: issue.path.map(String).join("."),
                                message: issue.message,
                            }
                        ))
                    }
                );
            }

            return res.status(500).json({ message: "Internal validation error" });
        }
    };