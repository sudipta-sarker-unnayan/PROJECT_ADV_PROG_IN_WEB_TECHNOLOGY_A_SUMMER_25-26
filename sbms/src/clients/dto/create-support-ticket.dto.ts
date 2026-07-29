import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateSupportTicketDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  priority?: string;

  @IsOptional()
  @IsNumber()
  projectId?: number;
}