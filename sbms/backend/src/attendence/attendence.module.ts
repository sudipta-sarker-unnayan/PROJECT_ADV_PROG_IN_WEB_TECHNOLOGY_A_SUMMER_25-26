import { Module } from '@nestjs/common';
import { AttendenceService } from './attendence.service';
import { AttendenceController } from './attendence.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendence } from './entities/attendence.entity';
import { Employee } from 'src/employees/entities/employee.entity';
import { EmployeesModule } from 'src/employees/employees.module';

@Module({
  imports: [TypeOrmModule.forFeature([Attendence, Employee]), EmployeesModule],
  controllers: [AttendenceController],
  providers: [AttendenceService],
})
export class AttendenceModule {}
