import { Entity, Unique, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";

import { Student } from "../students/Student.entity.js";
import { Course } from "../courses/Course.entity.js";

@Entity("results")
@Unique(["student", "course", "academicYear"])
export class Result {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => Student)
    @JoinColumn({ name: "studentId" })
    student!: Student;

    @ManyToOne(() => Course)
    @JoinColumn({ name: "courseId" })
    course!: Course;

    @Column("numeric", { precision: 5, scale: 2 })
    score!: number;

    @Column({ type: "varchar", nullable: true })
    grade!: string;

    @Column({ type: "int" })
    academicYear!: number;

    @CreateDateColumn()
    createdAt!: Date;
}