import { Request, Response } from "express";
import * as service from "./Course.service.js";

export const createCourse = async (req: Request, res: Response) => {
    try {
        const course = await service.createCourse(req.body);

        res.status(201).json({
            status: "success",
            message: "Course created successfully",
            data: course
        });
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }

};

export const getAllCourses = async (req: Request, res: Response) => {
    try {
        const { page, limit } = req.query as any;

        const result = await service.getCourses(Number(page) || 1, Number(limit) || 10);

        res.json({
            status: "success",
            message: "Courses retrieved successfully",
            data: result.data,
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages
        });
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }

};

export const getCourseById = async (req: Request, res: Response) => {
    try {
        const course = await service.getCourseById(req.params.id);

        if (!course) return res.status(404).json({ message: "Course Not found" });

        return res.json({
            status: "success",
            message: "Course retrieved successfully",
            data: course
        });
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }

};

export const updateCourse = async (req: Request, res: Response) => {
    try {
        const updated = await service.updateCourse(req.params.id, req.body);

        return res.json({
            status: "success",
            message: "Course updated successfully",
            data: updated
        });
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }

};

export const deleteCourse = async (req: Request, res: Response) => {
    try {
        await service.deleteCourse(req.params.id);

        return res.json({
            status: "success",
            message: "Course deleted successfully"
        });
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }

};