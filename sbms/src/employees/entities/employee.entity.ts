import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Department } from '../../departments/entities/department.entity';
import { Attendence } from 'src/attendence/entities/attendence.entity';
import { Leave } from 'src/leave/entities/leave.entity';
import { Task } from 'src/task/entities/task.entity';
import { Manager } from 'src/managers/entities/manager.entity';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Department, (department) => department.employees, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'department_id' })
  department: Department;


  @Column({ nullable: true })
  designation: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  salary: number;

  @OneToMany(() => Attendence, (attendence) => attendence.employee)
  attendence: Attendence[]

  @OneToMany(() => Leave, (leave) => leave.employee)
  leaves: Leave[];

  @OneToMany(() => Task, (task) => task.employee)
  task: Task[]

  @ManyToOne(() => Manager, (manager) => manager.employees, {
    nullable: true,
  })
  @JoinColumn({ name: 'manager_id' })
  manager: Manager;
}
