import { Router } from "express";
import { create, getAll, getById, update, remove } from "./Institute.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import { instituteSchema, paginationSchema } from "./Institute.schema.js";
import { protect } from "../../middleware/auth.middleware.js";

const router = Router();


router.post("/create", protect, validate(instituteSchema), create);

router.get("/", protect, validate(paginationSchema, "query"), getAll);

router.get("/:id", protect, getById);

router.put("/:id", protect, validate(instituteSchema), update);

router.delete("/:id", protect, remove);

export default router;