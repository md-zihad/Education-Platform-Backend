import { Request, Response } from "express";
import * as service from "./Institute.service.js";

export const create = async (req: Request, res: Response) => {
    try {
        const institute = await service.createInstitute(req.body);

        return res.status(201).json({
            status: "success",
            message: "Institute created successfully",
            data: institute
        });
    } catch (err: any) {
        return res.status(400).json({ message: err.message });
    }
};

export const getAll = async (req: Request, res: Response) => {
    try {
        const { page, limit } = req.query as {
            page?: number;
            limit?: number;
        };

        const result = await service.getInstitutes(page, limit);

        return res.json({
            status: "success",
            message: "Institutes retrieved successfully",
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
        const institute = await service.getInstituteById(req.params.id);

        if (!institute) return res.status(404).json({ message: "Not found" });

        return res.json({
            status: "success",
            message: "Institute retrieved successfully",
            data: institute
        });
    } catch (err: any) {
        return res.status(400).json({ message: err.message });
    }
};

export const update = async (req: Request, res: Response) => {
    try {
        const updated = await service.updateInstitute(req.params.id, req.body);

        return res.json({
            status: "success",
            message: "Institute updated successfully",
            data: updated
        });
    } catch (err: any) {
        return res.status(400).json({ message: err.message });
    }
};

export const remove = async (req: Request, res: Response) => {
    try {
        await service.deleteInstitute(req.params.id);

        return res.json({
            status: "success",
            message: "Institute deleted successfully"
        });
    } catch (err: any) {
        return res.status(400).json({ message: err.message });
    }
};