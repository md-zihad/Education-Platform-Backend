import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Student } from "../students/Student.entity.js";

@Entity("institutes")
export class Institute {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", unique: true })
    name!: string;

    @Column({ type: "int", nullable: false })
    establishedYear!: number;

    @Column({ type: "varchar", nullable: true })
    city?: string;

    @Column({ type: "varchar", nullable: true })
    country?: string;

    @Column({ type: "boolean", default: true })
    status?: boolean;

    @OneToMany(() => Student, (student) => student.institute)
    students!: Student[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}