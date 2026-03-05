import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";


export enum UserRole {
    ADMIN = "ADMIN"
};


@Entity("users")
export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", length: 255, unique: true })
    email!: string;

    @Column({ type: "varchar", length: 255 })
    password!: string;

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.ADMIN,
    })
    role!: UserRole;

    @Column({ type: "varchar", nullable: true })
    refreshToken?: string | null;

    @CreateDateColumn()
    createdAt!: Date;
};