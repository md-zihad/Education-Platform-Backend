import { Router } from "express";
import authRoutes from "./modules/auth/Auth.routes.js";
import instituteRoutes from "./modules/institutes/Institute.routes.js";

const router = Router();

router.use("/auth", authRoutes);

router.use("/institutes", instituteRoutes);


export default router;