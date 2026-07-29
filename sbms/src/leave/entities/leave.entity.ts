import { Employee } from "src/employees/entities/employee.entity";
import { Manager } from "src/managers/entities/manager.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum LeaveStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected'
}

@Entity('leave')
export class Leave {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    reason: string

    @Column({ type: 'date' })
    startDate: Date

    @Column({ type: 'date' })
    endDate: Date

    @Column({
        type: 'enum',
        enum: LeaveStatus,
        default: LeaveStatus.PENDING,
    })
    status: LeaveStatus

    @CreateDateColumn()
    createAt: Date

    @UpdateDateColumn()
    updateAt: Date

    @ManyToOne(() => Employee, (employee) => employee.leaves, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'employeeId' })
    employee: Employee;

    @ManyToOne(() => Manager, (manager) => manager.leaves, {
        nullable: true,
    })
    @JoinColumn({ name: 'managerId' })
    manager: Manager;

}
