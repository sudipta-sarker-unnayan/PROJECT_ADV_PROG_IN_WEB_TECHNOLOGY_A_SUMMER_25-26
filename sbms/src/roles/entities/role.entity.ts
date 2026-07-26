import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum RoleName {
  SUPER_ADMIN = 'super_admin',
  MANAGER = 'manager',
  EMPLOYEE = 'employee',
  CLIENT = 'client',
}

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: RoleName, unique: true })
  name: RoleName;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
