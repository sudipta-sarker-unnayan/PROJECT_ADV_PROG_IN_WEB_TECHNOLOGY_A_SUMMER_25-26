import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateMilestoneStatusDto {
  @IsNotEmpty()
  @IsString()
  status: string;
}