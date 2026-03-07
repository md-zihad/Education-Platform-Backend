import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from "typeorm";
import { Student } from "../students/Student.entity.js";

@Entity("institutes")
@Index("idx_institute_name", ["name"])
@Index("idx_institute_city", ["city"])
@Index("idx_institute_established_year", ["establishedYear"])
@Index("idx_institute_created", ["createdAt"])
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