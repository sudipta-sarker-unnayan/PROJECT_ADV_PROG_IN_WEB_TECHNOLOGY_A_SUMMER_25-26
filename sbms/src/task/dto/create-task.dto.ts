import { IsDateString, IsEnum, IsInt, IsNumber, IsString, Max, Min } from 'class-validator';

import { TaskPriority, TaskStatus } from '../entities/task.entity';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(TaskPriority)
  priority: TaskPriority;

  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsInt()
  @Min(0)
  @Max(100)
  progress: number;

  @IsDateString()
  startDate: Date;

  @IsDateString()
  deadline: Date;

  @IsNumber()
  employeeId: number;
}