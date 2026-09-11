import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { LeaveService } from './leave.service';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleName } from 'src/roles/entities/role.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleName.SUPER_ADMIN,RoleName.MANAGER)
@Controller('leave')
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}


  @Get()
  getAll(){
    return this.leaveService.getAll()
  }

  @Get(':id')
  getOneById(@Param('id')id:number){
    return this.leaveService.getOneById(id)
  }

  @Post()
  apply(@Body()dto:CreateLeaveDto){
    return this.leaveService.apply(dto)
  }

  @Patch(':id/status')
  updateStatus(@Param('id')id:number,@Body()dto:UpdateStatusDto){
    return this.leaveService.updateStatus(id,dto.status)
  }

  @Delete(':id')
  delete(@Param('id')id:number){
    return this.leaveService.delete(id)
  }
}
