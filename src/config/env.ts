import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: Number(process.env.PORT) || 5000,
  DB_HOST: process.env.DB_HOST!,
  DB_PORT: Number(process.env.DB_PORT),
  DB_USER: process.env.DB_USER!,
  DB_PASS: process.env.DB_PASS!,
  DB_NAME: process.env.DB_NAME!,
  JWT_ACCESS_SECRET: process.env.JWT_SECRET!,
  JWT_ACCESS_EXPIRES: Number(process.env.JWT_EXPIRES_IN!),
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  JWT_REFRESH_EXPIRES: Number(process.env.JWT_REFRESH_EXPIRES!),
};