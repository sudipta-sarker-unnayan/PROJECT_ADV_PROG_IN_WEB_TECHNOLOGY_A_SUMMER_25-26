import { Module } from '@nestjs/common';
import { AttendenceService } from './attendence.service';
import { AttendenceController } from './attendence.controller';
import { Attendence } from './entities/attendence.entity';
import { Employee } from 'src/employees/entities/employee.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[TypeOrmModule.forFeature([Attendence,Employee])],
  controllers: [AttendenceController],
  providers: [AttendenceService],
})
export class AttendenceModule {}
