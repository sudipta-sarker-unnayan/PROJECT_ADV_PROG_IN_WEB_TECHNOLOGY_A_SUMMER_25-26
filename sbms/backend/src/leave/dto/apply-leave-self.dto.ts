import { IsDateString, IsString } from 'class-validator';

export class ApplyLeaveSelfDto {
  @IsString()
  reason: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}
