import { AppDataSource } from "../../config/database.js";
import { Student } from "./Student.entity.js";
import { Institute } from "../institutes/Institute.entity.js";

const repo = () => AppDataSource.getRepository(Student);
const instituteRepo = () => AppDataSource.getRepository(Institute);

// Create Studetn
export const createStudent = async (data: any) => {
    const institute = await instituteRepo().findOne({ where: { id: data.instituteId } });

    if (!institute) throw new Error("Institute not found");

    const student = repo().create({ ...data, institute });

    return repo().save(student);
};

// Get All Students
export const getStudents = async (page = 1, limit = 10) => {
    const [data, total] = await repo().findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        order: { createdAt: "DESC" },
        relations: ["institute"],
    });

    return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
};

// Get Student By Id
export const getStudentById = async (id: string | any) => {
    return repo().findOne({
        where: { id },
        relations: ["institute"],
    });
};

// Update Student
export const updateStudent = async (id: string | any, data: any) => {

    const student = await repo().findOne({ where: { id } });

    if (!student) throw new Error("Student not found");


    if (data.instituteId) {
        const institute = await instituteRepo().findOne({ where: { id: data.instituteId } });

        if (!institute) throw new Error("Institute not found");

        student.institute = institute;
    }

    Object.assign(student, data);

    await repo().save(student);

    return getStudentById(id);
};

// Delete Student
export const deleteStudent = async (id: string | any) => {
    return repo().delete(id);
};