import { Request, Response } from "express";
import * as service from "./Result.service.js";

export const createResult = async (req: Request, res: Response) => {
    try {
        const result = await service.createResult(req.body);

        res.status(201).json({
            status: "success",
            message: "Result created successfully",
            data: result
        });
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
};

export const getResults = async (req: Request, res: Response) => {
    try {

        const filters = {
            studentId: req.query.studentId ? req.query.studentId : undefined,
            courseId: req.query.courseId ? req.query.courseId : undefined,
            academicYear: req.query.academicYear ? Number(req.query.academicYear) : undefined,
        };

        const { page, limit } = req.query as any;

        const results = await service.getResults(Number(page) || 1, Number(limit) || 10, filters);

        res.json({
            status: "success",
            message: "Results retrieved successfully",
            data: results.data,
            total: results.total,
            page: results.page,
            limit: results.limit,
            totalPages: results.totalPages
        });
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }

};

export const getResultById = async (req: Request, res: Response) => {

    try {
        const result = await service.getResultById(req.params.id);

        if (!result) {
            return res.status(404).json({ message: "Result not found" });
        }
        return res.json({
            status: "success",
            message: "Result retrieved successfully",
            data: result
        });
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
};

export const updateResult = async (req: Request, res: Response) => {

    try {
        const updated = await service.updateResult(
            req.params.id,
            req.body
        );
        return res.json({
            status: "success",
            message: "Result updated successfully",
            data: updated
        });
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
};

export const deleteResult = async (req: Request, res: Response) => {

    try {
        await service.deleteResult(req.params.id);

        return res.json({
            status: "success",
            message: "Result deleted successfully"
        });
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
};