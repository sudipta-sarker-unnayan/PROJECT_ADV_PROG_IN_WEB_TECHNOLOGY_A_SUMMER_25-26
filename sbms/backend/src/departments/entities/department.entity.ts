import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Employee } from '../../employees/entities/employee.entity';
import { Manager } from 'src/managers/entities/manager.entity';

@Entity('departments')
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => Employee, (employee) => employee.department)
  employees: Employee[];
<<<<<<< HEAD:sbms/src/departments/entities/department.entity.ts

  @OneToMany(() => Manager, (manager) => manager.department)
  managers: Manager[];
}
=======
}
>>>>>>> Full-Backend:sbms/backend/src/departments/entities/department.entity.ts
