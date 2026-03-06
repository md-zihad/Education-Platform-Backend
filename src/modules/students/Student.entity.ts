import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { Institute } from "../institutes/Institute.entity.js";


@Entity("students")
export class Student {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", length: 255 })
    name!: string;

    @Column({ type: "varchar", length: 255, unique: true })
    email!: string;

    @Column({ type: "integer", nullable: true })
    age?: number;

    @Column({ type: "varchar", length: 255, nullable: true })
    gender?: string;

    @ManyToOne(() => Institute, (institute) => institute.students, { eager: true })
    @JoinColumn({ name: "institute_id" })
    institute!: Institute;

    @Column({ type: "integer", nullable: true })
    enrollmentYear?: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}