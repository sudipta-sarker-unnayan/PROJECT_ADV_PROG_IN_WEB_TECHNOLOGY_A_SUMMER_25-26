import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateEmployeeDto {
  @IsInt()
  userId: number;

  @IsOptional()
  @IsInt()
  departmentId?: number;

  @IsOptional()
  @IsInt()
  managerId?: number;

  @IsOptional()
  @IsString()
  designation?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  salary?: number;
}