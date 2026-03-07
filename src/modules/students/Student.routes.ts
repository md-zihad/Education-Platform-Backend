import { Router } from "express";
import { create, getAll, getById, update, remove } from "./Student.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import { studentSchema, paginationSchema } from "./Student.schema.js";
import { protect } from "../../middleware/auth.middleware.js";

const router = Router();


router.post("/create", protect, validate(studentSchema), create);

router.get("/", protect, validate(paginationSchema, "query"), getAll);

router.get("/:id", protect, getById);

router.put("/:id", protect, validate(studentSchema), update);

router.delete("/:id", protect, remove);

export default router;