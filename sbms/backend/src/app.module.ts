import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DepartmentsModule } from './departments/departments.module';
import { EmployeesModule } from './employees/employees.module';
import { ClientsModule } from './clients/clients.module';
<<<<<<< HEAD:sbms/src/app.module.ts
import { AttendenceModule } from './attendence/attendence.module';
import { LeaveModule } from './leave/leave.module';
import { TaskModule } from './task/task.module';
import { ManagersModule } from './managers/managers.module';
=======
import { DashboardModule } from './dashboard/dashboard.module';
import { CacheModule } from '@nestjs/cache-manager';
import { AttendenceModule } from './attendence/attendence.module';
import { LeaveModule } from './leave/leave.module';
import { TaskModule } from './task/task.module';
>>>>>>> Full-Backend:sbms/backend/src/app.module.ts

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
<<<<<<< HEAD:sbms/src/app.module.ts
    AttendenceModule,
    LeaveModule,
    TaskModule,
    ManagersModule,
    
=======
<<<<<<< HEAD
    AttendenceModule,
    LeaveModule,
    TaskModule,
=======
    DashboardModule,
>>>>>>> origin/Full-Backend
>>>>>>> Full-Backend:sbms/backend/src/app.module.ts
    //   ProjectsModule, AttendanceModule,
    // LeaveModule, DashboardModule 
  ],
})
export class AppModule {}
