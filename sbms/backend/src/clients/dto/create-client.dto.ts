import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateClientDto {
  @IsInt()
  userId: number;

  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}