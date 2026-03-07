import { Request, Response } from "express";
import * as service from "./Student.service.js";

export const create = async (req: Request, res: Response) => {
    try {
        const student = await service.createStudent(req.body);

        return res.status(201).json({
            status: "success",
            message: "Student created successfully",
            data: student
        });
    } catch (err: any) {
        return res.status(400).json({ message: err.message });
    }
};

export const getAll = async (req: Request, res: Response) => {
    try {
        const { page, limit } = req.query as any;

        const result = await service.getStudents(Number(page) || 1, Number(limit) || 10);

        return res.json({
            status: "success",
            message: "Students retrieved successfully",
            data: result.data,
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages
        });
    } catch (err: any) {
        return res.status(400).json({ message: err.message });
    }
};

export const getById = async (req: Request, res: Response) => {
    try {
        const student = await service.getStudentById(req.params.id);

        if (!student) return res.status(404).json({ message: "Not found" });

        return res.json({
            status: "success",
            message: "Student retrieved successfully",
            data: student
        });
    } catch (err: any) {
        return res.status(400).json({ message: err.message });
    }
};

export const update = async (req: Request, res: Response) => {
    try {
        const updated = await service.updateStudent(req.params.id, req.body);

        return res.json({
            status: "success",
            message: "Student updated successfully",
            data: updated
        });
    } catch (err: any) {
        return res.status(400).json({ message: err.message });
    }
};

export const remove = async (req: Request, res: Response) => {
    try {
        await service.deleteStudent(req.params.id);

        return res.json({
            status: "success",
            message: "Student deleted successfully"
        });
    } catch (err: any) {
        return res.status(400).json({ message: err.message });
    }
};