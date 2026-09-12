import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { TaskPriority, TaskStatus } from '../entities/task.entity';
import { Type } from 'class-transformer';

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

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  clientId?: number;
}
