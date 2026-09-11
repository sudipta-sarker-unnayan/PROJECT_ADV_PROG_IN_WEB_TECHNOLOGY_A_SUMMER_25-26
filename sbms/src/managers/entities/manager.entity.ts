import { Attendence } from "src/attendence/entities/attendence.entity";
import { Department } from "src/departments/entities/department.entity";
import { Employee } from "src/employees/entities/employee.entity";
import { Leave } from "src/leave/entities/leave.entity";
import { Task } from "src/task/entities/task.entity";
import { User } from "src/users/entities/user.entity";
import { Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('manager')
export class Manager {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User, (user) => user.manager)
    @JoinColumn({ name: 'user_id' })
    user: User

    @ManyToOne(() => Department, (department) => department.managers, {
        nullable: true,
    })
    @JoinColumn({ name: 'department_id' })
    department: Department;

    @OneToMany(() => Employee, (employee) => employee.manager)
    employees: Employee[];

    @OneToMany(() => Task, (task) => task.manager)
    tasks: Task[];

    @OneToMany(() => Attendence, (attendance) => attendance.manager)
    attendances: Attendence[];

    @OneToMany(() => Leave, (leave) => leave.manager)
    leaves: Leave[];
}

