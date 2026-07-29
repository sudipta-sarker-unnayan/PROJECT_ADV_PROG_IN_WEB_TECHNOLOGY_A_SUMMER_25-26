import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ManagersService } from './managers.service';
import { CreateManagerDto } from './dto/create-manager.dto';
import { UpdateManagerDto } from './dto/update-manager.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleName } from 'src/roles/entities/role.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleName.SUPER_ADMIN)
@Controller('managers')
export class ManagersController {
  constructor(private readonly managersService: ManagersService) {}

  @Get()
  getAll() {
    return this.managersService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.managersService.getOne(id);
  }

  @Post()
  createManager(@Body() dto: CreateManagerDto) {
    return this.managersService.createManager(dto);
  }

  @Patch(':id')
  updateManager(@Param('id') id: number,@Body() dto: UpdateManagerDto){
    return this.managersService.updateManager(id, dto);
  }

  @Delete(':id')
  deleteManager(@Param('id') id: number){
    return this.managersService.deleteManager(id);
  }

}
