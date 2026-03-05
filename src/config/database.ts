import { DataSource } from "typeorm";
import { env } from "./env.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
  entities: ["src/modules/**/*.entity.ts"],
  synchronize: false,
  logging: false,
});