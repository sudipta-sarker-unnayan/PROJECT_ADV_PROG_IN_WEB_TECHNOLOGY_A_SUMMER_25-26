import {Entity, PrimaryGeneratedColumn, Column,ManyToOne, JoinColumn,} from 'typeorm';
import { Project } from './project.entity';

@Entity('milestones')
export class Milestone {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ default: 'Pending' })
  status: string;

  @Column()
  project_id: number;

  @ManyToOne(() => Project, (project) => project.milestones, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: Project;
}