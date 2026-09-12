import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Task } from 'src/task/entities/task.entity';

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ name: 'company_name', nullable: true })
  companyName!: string;

  @Column({ nullable: true })
  phone!: string;

  @OneToMany(() => Task, (task) => task.client)
  tasks!: Task[];
}
