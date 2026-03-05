import { Router } from "express";
import { signup } from "./Auth.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import { signupSchema } from "./Auth.schema.js";


const router = Router();

router.post("/signup", validate(signupSchema), signup);

export default router;