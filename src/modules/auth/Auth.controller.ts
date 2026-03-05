import { Request, Response } from "express";
import * as authService from "./Auth.service.js";

export const signup = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await authService.signup(email, password);

        return res.status(201).json({
            message: "User created successfully",
            data: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
};