import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm";

@Entity("courses")
@Index("idx_course_code", ["code"])
@Index("idx_course_name", ["name"])
@Index("idx_course_created", ["createdAt"])

export class Course {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", length: 255 })
    name!: string;

    @Column({ type: "varchar", length: 255, unique: true })
    code!: string;

    @Column({ type: "integer", default: 3 })
    credits!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}