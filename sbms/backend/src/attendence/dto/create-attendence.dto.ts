import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { AttendenceStatus } from '../entities/attendence.entity';
import { Transform } from 'class-transformer';

export class CreateAttendenceDto {
  @IsDateString()
  date: Date;

  @IsString()
  @IsNotEmpty()
  checkIn: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? undefined : value))
  checkOut: string;

  @IsOptional()
  status?: AttendenceStatus;

  @IsNumber()
  employeeId: number;
}
