import { Router } from "express";
import { createCourse, getAllCourses, updateCourse, deleteCourse, getCourseById } from "./Course.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import { createCourseSchema, updateCourseSchema, paginationSchema } from "./Course.schema.js";
import { protect } from "../../middleware/auth.middleware.js"


const router = Router();

router.post("/create", protect, validate(createCourseSchema), createCourse);

router.get("/", protect, validate(paginationSchema, "query"), getAllCourses);

router.get("/:id", protect, getCourseById);

router.put("/:id", protect, validate(updateCourseSchema), updateCourse);

router.delete("/:id", protect, deleteCourse);

export default router;