import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

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

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}