<<<<<<< HEAD:sbms/src/users/entities/user.entity.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
=======
import {Column,CreateDateColumn,Entity,JoinColumn,ManyToOne,PrimaryGeneratedColumn,UpdateDateColumn} from 'typeorm';
>>>>>>> Full-Backend:sbms/backend/src/users/entities/user.entity.ts
import { Exclude } from 'class-transformer';
import { Role } from '../../roles/entities/role.entity';
import { Manager } from 'src/managers/entities/manager.entity';

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column({ name: 'password_hash' })
  passwordHash: string;

  @ManyToOne(() => Role, (role) => role.users, { eager: true })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({
    type: 'varchar',
    name: 'reset_token',
    nullable: true,
  })
  resetToken: string | null;

  @Column({
    name: 'reset_token_expiry',
    type: 'timestamp',
    nullable: true,
  })
  resetTokenExpiry: Date | null;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
<<<<<<< HEAD:sbms/src/users/entities/user.entity.ts

  @OneToOne(() => Manager, (manager) => manager.user)
  manager: Manager;
}
=======
}
>>>>>>> Full-Backend:sbms/backend/src/users/entities/user.entity.ts
