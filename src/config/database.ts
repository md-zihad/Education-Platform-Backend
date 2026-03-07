import { DataSource } from "typeorm";
import { env } from "./env.js";
import { User } from "../modules/user/User.entity.js";
import { Institute } from "../modules/institutes/Institute.entity.js";
import { Student } from "../modules/students/Student.entity.js";
import { Course } from "../modules/courses/Course.entity.js";
import { Result } from "../modules/results/Result.entity.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
  entities: [User, Institute, Student, Course, Result],
  synchronize: true,
  logging: false,
});