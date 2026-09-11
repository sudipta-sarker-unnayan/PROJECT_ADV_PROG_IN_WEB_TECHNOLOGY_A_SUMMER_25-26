import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { LeaveService } from './leave.service';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { Leave } from './entities/leave.entity';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleName } from 'src/roles/entities/role.entity';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ApplyLeaveSelfDto } from './dto/apply-leave-self.dto';

interface CurrentUserPayload {
  userId: number;
  email: string;
  role: string;
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('leave')
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Get()
  @Roles(RoleName.SUPER_ADMIN,RoleName.MANAGER)
  async getAll():Promise<Leave[]>{
    const leave = await this.leaveService.getAll();
    return leave
  }

  @Get('my')
  @Roles(RoleName.EMPLOYEE)
  async getMyLeaves(@CurrentUser() user: CurrentUserPayload): Promise<Leave[]> {
    return this.leaveService.getMyLeaves(user.userId);
  }

  @Get(':id')
  @Roles(RoleName.SUPER_ADMIN,RoleName.MANAGER)
  async getLeaveById(@Param('id')id:number):Promise<Leave>{
    const leave = await this.leaveService.getLeaveById(id)
    return leave
  }

  @Post()
  @Roles(RoleName.SUPER_ADMIN,RoleName.MANAGER)
  async apply(@Body() createLeaveDto:CreateLeaveDto):Promise<Leave>{
    const leave = await this.leaveService.apply(createLeaveDto)
    return leave
  }

  @Post('apply')
  @Roles(RoleName.EMPLOYEE)
  async applyForSelf(@Body() dto: ApplyLeaveSelfDto,@CurrentUser() user: CurrentUserPayload):Promise<Leave>{
    return this.leaveService.applyForSelf(user.userId, dto);
  }

  @Patch(':id/status')
  @Roles(RoleName.SUPER_ADMIN,RoleName.MANAGER)
  async updateStatus(@Param('id')id:number,@Body()updateStatusDto:UpdateStatusDto):Promise<Leave>{
    const leave = await this.leaveService.updateStatus(id,updateStatusDto.status)
    return leave
  }

  @Delete(':id')
  @Roles(RoleName.SUPER_ADMIN,RoleName.MANAGER)
  async delete(@Param('id')id:number):Promise<string>{
    const leave = await this.leaveService.delete(id)
    return leave
  }
  
}
