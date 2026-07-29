import { Module } from '@nestjs/common';
import { ManagersService } from './managers.service';
import { ManagersController } from './managers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Manager } from './entities/manager.entity';
import { User } from 'src/users/entities/user.entity';
import { Department } from 'src/departments/entities/department.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Manager,User,Department])],
  controllers: [ManagersController],
  providers: [ManagersService],
})
export class ManagersModule {}
