import { AppDataSource } from "../../config/database.js";
import { Result } from "./Result.entity.js";
import { Student } from "../students/Student.entity.js";
import { Course } from "../courses/Course.entity.js";

const resultRepo = AppDataSource.getRepository(Result);
const studentRepo = AppDataSource.getRepository(Student);
const courseRepo = AppDataSource.getRepository(Course);



export const createResult = async (data: any) => {

    const student = await studentRepo.findOneBy({ id: data.studentId });

    if (!student) {
        throw new Error("Student not found");
    }

    const course = await courseRepo.findOneBy({ id: data.courseId });

    if (!course) {
        throw new Error("Course not found");
    }

    const result = resultRepo.create({
        student: student,
        course: course,
        score: data.score,
        grade: data.grade,
        academicYear: data.academicYear
    });

    return resultRepo.save(result);
};

export const getResults = async (page: number, limit: number, filters: {
    studentId?: string;
    courseId?: string;
    academicYear?: number;
} | any) => {


    const where: any = {};

    if (filters.studentId) {
        where.student = { id: filters.studentId };
    }

    if (filters.courseId) {
        where.course = { id: filters.courseId };
    }

    if (filters.academicYear) {
        where.academicYear = filters.academicYear;
    }

    const [data, total] = await resultRepo.findAndCount({
        where,
        relations: ["student", "course"],
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

export const getResultById = async (id: number | any) => {

    return resultRepo.findOne({
        where: { id },
        relations: ["student", "course"],
    });
};

export const updateResult = async (id: number | any, data: any) => {

    await resultRepo.update(id, data);

    return resultRepo.findOneBy({ id });
};

export const deleteResult = async (id: number | any) => {

    return resultRepo.delete(id);
};