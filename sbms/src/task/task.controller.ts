import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { Task } from './entities/task.entity';

@Controller('task')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
  ) {}

  
  @Get()
  async getAll(){
    const task = this.taskService.getAll()
    return task
  }

  @Get('employee/:employeeId')
  getTaskByEmployee(@Param('employeeId')employeeId: number){
    const task = this.taskService.getTaskByEmployee(employeeId)
    return task
  }

  @Get(':id')
  getOne(@Param('id')id: number,){
    const task =  this.taskService.getOne(id)
    return task
  }

  @Post()
  createTask(@Body() dto: CreateTaskDto) {
    const task = this.taskService.createTask(dto)
    return task
  }

  @Patch(':id')
  updateTask(@Param('id')id: number,@Body()dto: UpdateTaskDto){
    const task =  this.taskService.updateTask(id, dto)
    return task
  }

  @Patch(':id/progress')
  updateProgress(@Param('id')id: number,@Body()dto: UpdateProgressDto){
    const task = this.taskService.updateProgress(id, dto)
    return task
  }

  @Delete(':id')
  deleteTask(@Param('id')id: number){
    const task =  this.taskService.deleteTask(id)
    return task
  }
}