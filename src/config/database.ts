import { DataSource } from "typeorm";
import { env } from "./env.js";
import { User } from "../modules/user/User.entity.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
  entities: [User],
  synchronize: true,
  logging: false,
});