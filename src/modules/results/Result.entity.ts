import { Entity, Unique, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, Index } from "typeorm";

import { Student } from "../students/Student.entity.js";
import { Course } from "../courses/Course.entity.js";

@Entity("results")
@Index("idx_result_student", ["student"])
@Index("idx_result_course", ["course"])
@Index("idx_result_year", ["academicYear"])
@Index("idx_result_student_year", ["student", "academicYear"])
@Index("idx_result_course_year", ["course", "academicYear"])
@Index("idx_result_created", ["createdAt"])
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