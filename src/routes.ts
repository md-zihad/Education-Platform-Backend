import { Router } from "express";
import authRoutes from "./modules/auth/Auth.routes.js";
import instituteRoutes from "./modules/institutes/Institute.routes.js";
import studentRoutes from "./modules/students/Student.routes.js";
import courseRoutes from "./modules/courses/Course.routes.js";
import resultRoutes from "./modules/results/Result.routes.js";

const router = Router();

router.use("/auth", authRoutes);

router.use("/institutes", instituteRoutes);

router.use("/students", studentRoutes);

router.use("/courses", courseRoutes);

router.use("/results", resultRoutes);


export default router;