import { IsEnum, IsInt, Max, Min } from 'class-validator';
import { TaskStatus } from 'src/task/entities/task.entity';


export class UpdateProgressDto {
  @IsInt()
  @Min(0)
  @Max(100)
  progress: number;

  @IsEnum(TaskStatus)
  status: TaskStatus;
}