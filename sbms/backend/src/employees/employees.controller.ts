import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleName } from '../roles/entities/role.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

interface CurrentUserPayload {
  userId: number;
  email: string;
  role: string;
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleName.SUPER_ADMIN,RoleName.MANAGER)
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get('me')
  @Roles(RoleName.EMPLOYEE)
  getMyProfile(@CurrentUser() user: CurrentUserPayload) {
    return this.employeesService.findByUserId(user.userId);
  }

  @Post()
  @Roles(RoleName.SUPER_ADMIN)
  create(@Body() dto: CreateEmployeeDto) {
    return this.employeesService.create(dto);
  }

  @Get()
  @Roles(RoleName.SUPER_ADMIN)
  findAll() {
    return this.employeesService.findAll();
  }

  @Get(':id')
  @Roles(RoleName.SUPER_ADMIN)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.findOne(id);
  }

  @Patch(':id')
  @Roles(RoleName.SUPER_ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEmployeeDto) {
    return this.employeesService.update(id, dto);
  }

  @Delete(':id')
  @Roles(RoleName.SUPER_ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.remove(id);
  }
}