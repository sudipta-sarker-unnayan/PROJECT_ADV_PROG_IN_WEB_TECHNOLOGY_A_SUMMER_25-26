import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Department } from '../../departments/entities/department.entity';

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

  @ManyToOne(() => Employee, { nullable: true })
  @JoinColumn({ name: 'manager_id' })
  manager: Employee;

  @Column({ nullable: true })
  designation: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  salary: number;
}
