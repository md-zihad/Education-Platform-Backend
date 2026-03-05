import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

interface JwtPayload {
    userId: string;
    email: string;
    role: string;
}

export const signAccessToken = (payload: JwtPayload) => {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
        expiresIn: env.JWT_ACCESS_EXPIRES,
    });
};

export const signRefreshToken = (payload: JwtPayload) => {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
        expiresIn: env.JWT_REFRESH_EXPIRES,
    });
};

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, env.JWT_ACCESS_SECRET);
};

export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, env.JWT_REFRESH_SECRET);
};