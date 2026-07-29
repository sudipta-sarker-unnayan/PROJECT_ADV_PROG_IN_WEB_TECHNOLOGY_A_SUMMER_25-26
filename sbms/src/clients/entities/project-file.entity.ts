import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn,} from 'typeorm';
import { Project } from './project.entity';

@Entity('project_files')
export class ProjectFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  file_name: string;

  @Column()
  file_path: string;

  @Column()
  project_id: number;

  @ManyToOne(() => Project, (project) => project.files, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @CreateDateColumn()
  created_at: Date;
}