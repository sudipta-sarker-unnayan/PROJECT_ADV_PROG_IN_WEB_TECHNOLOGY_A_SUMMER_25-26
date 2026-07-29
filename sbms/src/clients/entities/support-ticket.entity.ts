import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn,} from 'typeorm';
import { Client } from './client.entity';

@Entity('support_tickets')
export class SupportTicket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ default: 'Open' })
  status: string;

  @Column({ default: 'Medium' })
  priority: string;

  @Column()
  client_id: number;

  @Column({ type: 'int', nullable: true })
  project_id: number | null;

  @ManyToOne(() => Client, (client) => client.support_tickets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @CreateDateColumn()
  created_at: Date;
}