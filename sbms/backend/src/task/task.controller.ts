import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  ParseIntPipe,
  UploadedFile,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { Task } from './entities/task.entity';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleName } from 'src/roles/entities/role.entity';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { completedFileUploadOptions } from 'src/common/config/multer.config';
import { UploadedFileInfo } from 'src/common/interfaces/uploaded-file.interface';

export interface CurrentUserPayload {
  userId: number;
  email: string;
  role: string;
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  @Roles(RoleName.SUPER_ADMIN, RoleName.MANAGER)
  async getAll(): Promise<Task[]> {
    const task = await this.taskService.getAll();
    return task;
  }

  @Get('my')
  @Roles(RoleName.EMPLOYEE)
  async getMyTasks(@CurrentUser() user: CurrentUserPayload): Promise<Task[]> {
    return this.taskService.getMyTasksAsEmployee(user.userId);
  }

  @Get('client/my')
  @Roles(RoleName.CLIENT)
  async getMyTasksAsClient(
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<Task[]> {
    return this.taskService.getMyTasksAsClient(user.userId);
  }

  @Get(':id')
  @Roles(
    RoleName.SUPER_ADMIN,
    RoleName.MANAGER,
    RoleName.EMPLOYEE,
    RoleName.CLIENT,
  )
  async getTaskById(@Param('id') id: number): Promise<Task> {
    const task = await this.taskService.getTaskById(id);
    return task;
  }

  @Get('employee/:employeeId')
  @Roles(RoleName.SUPER_ADMIN, RoleName.MANAGER)
  async getTaskByEmployee(
    @Param('employeeId') employeeId: number,
  ): Promise<Task[]> {
    const task = await this.taskService.getTaskByEmployee(employeeId);
    return task;
  }

  @Post()
  @Roles(RoleName.SUPER_ADMIN, RoleName.MANAGER)
  async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    const task = await this.taskService.createTask(createTaskDto);
    return task;
  }

  @Post(':id/completed-file')
  @Roles(RoleName.EMPLOYEE)
  @UseInterceptors(FileInterceptor('file', completedFileUploadOptions))
  async uploadCompletedFile(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: UploadedFileInfo | undefined,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<Task> {
    return this.taskService.uploadCompletedFile(id, file, user);
  }

  @Patch(':id')
  @Roles(RoleName.SUPER_ADMIN, RoleName.MANAGER)
  async updateTask(
    @Param('id') id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.taskService.updateTask(id, updateTaskDto);
    return task;
  }

  @Patch(':id/progress')
  @Roles(RoleName.SUPER_ADMIN, RoleName.MANAGER, RoleName.EMPLOYEE)
  async updateProgress(
    @Param('id') id: number,
    @Body() updateProgressDto: UpdateProgressDto,
  ): Promise<Task> {
    const task = await this.taskService.updateProgress(id, updateProgressDto);
    return task;
  }

  @Delete(':id')
  @Roles(RoleName.SUPER_ADMIN, RoleName.MANAGER)
  async deleteTask(@Param('id') id: number): Promise<string> {
    const task = await this.taskService.deleteTask(id);
    return task;
  }
}
