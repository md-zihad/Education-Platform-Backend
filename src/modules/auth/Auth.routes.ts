import { Router } from "express";
import { signup, login, logout, refresh } from "./Auth.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import { signupSchema } from "./Auth.schema.js";
import { protect } from "../../middleware/auth.middleware.js";


const router = Router();

router.post("/signup", validate(signupSchema), signup);

// Since the login and signup schemas are the same, we can reuse the signupSchema for login validation
router.post("/login", validate(signupSchema), login);

router.post("/refresh", refresh);

router.post("/logout", protect, logout);

export default router;