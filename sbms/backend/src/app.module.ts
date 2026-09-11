import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DepartmentsModule } from './departments/departments.module';
import { EmployeesModule } from './employees/employees.module';
import { ClientsModule } from './clients/clients.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { CacheModule } from '@nestjs/cache-manager';
import { AttendenceModule } from './attendence/attendence.module';
import { LeaveModule } from './leave/leave.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({
  isGlobal: true,
  ttl: 60 * 1000,
  max: 100,
}),
    DatabaseModule,
    RolesModule,
    UsersModule,
    AuthModule,
    DepartmentsModule,
    EmployeesModule,
    ClientsModule,
<<<<<<< HEAD
    AttendenceModule,
    LeaveModule,
    TaskModule,
=======
    DashboardModule,
>>>>>>> origin/Full-Backend
    //   ProjectsModule, AttendanceModule,
    // LeaveModule, DashboardModule 
  ],
})
export class AppModule {}
