import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AttendenceService } from './attendence.service';
import { CreateAttendenceDto } from './dto/create-attendence.dto';
import { Attendence } from './entities/attendence.entity';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { RoleName } from 'src/roles/entities/role.entity';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

interface CurrentUserPayload {
  userId: number;
  email: string;
  role: string;
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('attendence')
export class AttendenceController {
  constructor(private readonly attendenceSrevice: AttendenceService) {}

  @Get()
  @Roles(RoleName.SUPER_ADMIN, RoleName.MANAGER)
  async getAllAttendence(): Promise<Attendence[]> {
    const attendence = await this.attendenceSrevice.getAllAttendence();
    return attendence;
  }

  @Get(':id')
  @Roles(RoleName.SUPER_ADMIN, RoleName.MANAGER)
  async getAttendenceById(@Param('id') id: number): Promise<Attendence> {
    const attendence = await this.attendenceSrevice.getAttendenceById(id);
    return attendence;
  }

  @Get('my')
  @Roles(RoleName.EMPLOYEE)
  async getMyAttendence(
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<Attendence[]> {
    return this.attendenceSrevice.getMyAttendence(user.userId);
  }

  @Post()
  @Roles(RoleName.SUPER_ADMIN, RoleName.MANAGER)
  async giveAttendence(
    @Body() createAttendenceDto: CreateAttendenceDto,
  ): Promise<Attendence> {
    const attendence =
      await this.attendenceSrevice.giveAttendence(createAttendenceDto);
    return attendence;
  }

  @Post('check-in')
  @Roles(RoleName.EMPLOYEE)
  async checkIn(@CurrentUser() user: CurrentUserPayload): Promise<Attendence> {
    return this.attendenceSrevice.checkIn(user.userId);
  }

  @Patch('check-out')
  @Roles(RoleName.EMPLOYEE)
  async checkOut(@CurrentUser() user: CurrentUserPayload): Promise<Attendence> {
    return this.attendenceSrevice.checkOut(user.userId);
  }
}
