import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsNumber()
  taskId: number;

  @IsNotEmpty()
  @IsString()
  comment: string;

  @IsOptional()
  @IsNumber()
  parentCommentId?: number;
}