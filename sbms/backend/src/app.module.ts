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
import { CacheModule } from '@nestjs/cache-manager';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({ isGlobal: true, ttl: 60 * 1000, max: 100 }),
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
    DashboardModule,
  ],
})
export class AppModule {}
