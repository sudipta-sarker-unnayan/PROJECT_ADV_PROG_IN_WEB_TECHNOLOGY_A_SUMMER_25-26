import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DepartmentsModule } from './departments/departments.module';
import { EmployeesModule } from './employees/employees.module';
import { ClientsModule } from './clients/clients.module';
import { AttendenceModule } from './attendence/attendence.module';
import { LeaveModule } from './leave/leave.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    RolesModule,
    UsersModule,
    AuthModule,
    DepartmentsModule,
    EmployeesModule,
    ClientsModule,
    AttendenceModule,
    LeaveModule,
    TaskModule,
    
    //   ProjectsModule, AttendanceModule,
    // LeaveModule, DashboardModule 
  ],
})
export class AppModule {}
