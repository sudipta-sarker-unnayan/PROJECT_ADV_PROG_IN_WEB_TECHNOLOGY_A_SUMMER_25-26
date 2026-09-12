import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Employee } from 'src/employees/entities/employee.entity';
import { EmployeesModule } from 'src/employees/employees.module';
import { ClientsModule } from 'src/clients/clients.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, Employee]),
    EmployeesModule,
    ClientsModule,
  ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
