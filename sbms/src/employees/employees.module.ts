import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { User } from '../users/entities/user.entity';
import { Department } from '../departments/entities/department.entity';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { Manager } from 'src/managers/entities/manager.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, User, Department,Manager])],
  controllers: [EmployeesController],
  providers: [EmployeesService],
  exports: [TypeOrmModule],
})
export class EmployeesModule {}