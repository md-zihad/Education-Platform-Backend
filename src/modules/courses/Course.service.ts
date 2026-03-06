import { AppDataSource } from "../../config/database.js";
import { Course } from "./Course.entity.js";

const repo = AppDataSource.getRepository(Course);


// Create course
export const createCourse = async (data: any) => {

    const course = repo.create(data);

    return repo.save(course);
};

// Get all course
export const getCourses = async (page: number, limit: number) => {

    const [data, total] = await repo.findAndCount({
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

// Get single course
export const getCourseById = async (id: string | any) => {
    return repo.findOneBy({ id });
};

// Update course
export const updateCourse = async (id: string | any, data: any) => {

    await repo.update(id, data);

    return repo.findOneBy({ id });
};

// Delete course
export const deleteCourse = async (id: string | any) => {
    return repo.delete(id);
};