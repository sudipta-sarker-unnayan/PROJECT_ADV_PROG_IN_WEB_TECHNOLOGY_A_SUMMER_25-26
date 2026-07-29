import {Entity,PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany,} from 'typeorm';
import { Client } from './client.entity';
import { Milestone } from './milestone.entity';
import { ProjectFile } from './project-file.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ default: 'In Progress' })
  status: string;

  @Column()
  client_id: number;

  @ManyToOne(() => Client, (client) => client.projects, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @OneToMany(() => Milestone, (milestone) => milestone.project)
  milestones: Milestone[];

  @OneToMany(() => ProjectFile, (file) => file.project)
  files: ProjectFile[];

  @CreateDateColumn()
  created_at: Date;
}