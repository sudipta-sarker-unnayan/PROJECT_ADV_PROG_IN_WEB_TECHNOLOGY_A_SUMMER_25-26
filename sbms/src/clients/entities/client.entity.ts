import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Project } from './project.entity';
import { SupportTicket } from './support-ticket.entity';

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', unique: true })
  user_id: number;

  @Column({ name: 'company_name', nullable: true })
  company_name: string;

  @Column({ name: 'contact_person', nullable: true })
  contact_person: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  industry: string;

  // Add the OneToMany relation definitions here:
  @OneToMany(() => Project, (project) => project.client, { cascade: true })
  projects: Project[];

  @OneToMany(() => SupportTicket, (ticket) => ticket.client, { cascade: true })
  support_tickets: SupportTicket[];
}