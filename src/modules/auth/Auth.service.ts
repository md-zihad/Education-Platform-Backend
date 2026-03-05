import { AppDataSource } from "../../config/database.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../utils/jwt.js";
import { User, UserRole } from "../user/User.entity.js";
import bcrypt from "bcrypt";

const userRepo = () => AppDataSource.getRepository(User);

export const signup = async (email: string, password: string) => {
    const repo = userRepo();

    const existingUser = await repo.findOne({ where: { email } });

    if (existingUser) throw new Error("Email already registered");

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = repo.create({
        email,
        password: hashedPassword,
        role: UserRole.ADMIN,
    });

    return repo.save(user);
};


export const login = async (email: string, password: string) => {
    const repo = userRepo();

    const user = await repo.findOne({ where: { email } });

    if (!user) throw new Error("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const payload = { userId: user.id, email: user.email, role: user.role };

    const accessToken = signAccessToken(payload);

    const refreshToken = signRefreshToken(payload);

    user.refreshToken = await bcrypt.hash(refreshToken, 10);
    await repo.save(user);

    return { accessToken, refreshToken };
};


export const refresh = async (refreshToken: string) => {
    const repo = userRepo();

    const decoded: any = verifyRefreshToken(refreshToken);

    const user = await repo.findOne({ where: { id: decoded.userId } });

    if (!user || !user.refreshToken) {
        throw new Error("Unauthorized");
    }

    const isMatch = await bcrypt.compare(
        refreshToken,
        user.refreshToken
    );

    if (!isMatch) throw new Error("Unauthorized");

    const payload = { userId: user.id, email: user.email, role: user.role };

    const newAccessToken = signAccessToken(payload);

    const newRefreshToken = signRefreshToken(payload);

    user.refreshToken = await bcrypt.hash(newRefreshToken, 10);
    await repo.save(user);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};


export const logout = async (userId: string) => {
    const repo = userRepo();

    await repo.update(userId, { refreshToken: null });
};