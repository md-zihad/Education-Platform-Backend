import { AppDataSource } from "../../config/database.js";
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