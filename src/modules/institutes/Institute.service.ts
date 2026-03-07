import { AppDataSource } from "../../config/database.js";
import { Institute } from "./Institute.entity.js";

const repo = () => AppDataSource.getRepository(Institute);

// Create Institute
export const createInstitute = async (data: Partial<Institute>) => {
    const institute = repo().create(data);

    return repo().save(institute);
};

// Get all institutes
export const getInstitutes = async (page = 1, limit = 10) => {
    const [data, total] = await repo().findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        order: { createdAt: "DESC" },
    });

    return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
};

// Get institute by Id
export const getInstituteById = async (id: string | any) => {
    return repo().findOne({ where: { id } });
};

// Update institute
export const updateInstitute = async (id: string | any, data: Partial<Institute>) => {
    await repo().update(id, data);

    return getInstituteById(id);
};

// Delete institute
export const deleteInstitute = async (id: string | any) => {
    return repo().delete(id);
};