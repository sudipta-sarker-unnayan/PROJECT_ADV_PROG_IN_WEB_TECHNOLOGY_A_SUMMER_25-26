import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { Client } from './entities/client.entity';
import { Project } from './entities/project.entity';
import { Milestone } from './entities/milestone.entity';
import { ProjectFile } from './entities/project-file.entity';
import { TaskComment } from './entities/task-comment.entity';
import { SupportTicket } from './entities/support-ticket.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Client,
      Project,
      Milestone,
      ProjectFile,
      TaskComment,
      SupportTicket,
    ]),
  ],
  controllers: [ClientsController],
  providers: [ClientsService],
  exports: [ClientsService],
})
export class ClientsModule {}