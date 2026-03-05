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


export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const { accessToken, refreshToken } =
            await authService.login(email, password);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
        });

        return res.json({ accessToken });
    } catch (error: any) {
        return res.status(401).json({ message: error.message });
    }
};

export const refresh = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) throw new Error("Unauthorized");

        const tokens = await authService.refresh(refreshToken);

        res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
        });

        return res.json({ accessToken: tokens.accessToken });
    } catch (error: any) {
        return res.status(401).json({ message: error.message });
    }
};


export const logout = async (req: any, res: Response) => {
    try {
        await authService.logout(req.user.userId);

        res.clearCookie("refreshToken");

        return res.json({ message: "Logged out successfully" });
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
};