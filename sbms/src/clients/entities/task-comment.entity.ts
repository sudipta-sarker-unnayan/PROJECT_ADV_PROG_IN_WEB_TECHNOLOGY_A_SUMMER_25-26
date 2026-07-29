import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,} from 'typeorm';

@Entity('task_comments')
export class TaskComment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  task_id: number;

  @Column()
  user_id: number;

  @Column('text')
  comment: string;

  @Column({ type: 'int', nullable: true })
  parent_comment_id: number | null;

  @CreateDateColumn()
  created_at: Date;
}