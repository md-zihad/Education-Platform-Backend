import { Router } from "express";
import { createResult, getResults, getResultById, updateResult, deleteResult } from "./Result.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import { protect } from "../../middleware/auth.middleware.js";
import { createResultSchema, updateResultSchema, paginationSchema } from "./Result.schema.js";

const router = Router();

router.post("/create", validate(createResultSchema), createResult);

router.get("/", validate(paginationSchema, "query"), getResults);

router.get("/:id", getResultById);

router.put("/:id", validate(updateResultSchema), updateResult);

router.delete("/:id", deleteResult);

export default router;