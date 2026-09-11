import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Employee } from 'src/employees/entities/employee.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Task,Employee])],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
