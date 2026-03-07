import { Router } from "express";
import { createResult, getResults, getResultById, updateResult, deleteResult } from "./Result.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import { protect } from "../../middleware/auth.middleware.js";
import { createResultSchema, updateResultSchema, paginationSchema } from "./Result.schema.js";

const router = Router();

router.post("/create", protect, validate(createResultSchema), createResult);

router.get("/", protect, validate(paginationSchema, "query"), getResults);

router.get("/:id", protect, getResultById);

router.put("/:id", protect, validate(updateResultSchema), updateResult);

router.delete("/:id", protect, deleteResult);

export default router;