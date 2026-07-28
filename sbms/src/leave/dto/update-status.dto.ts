import { IsEnum } from 'class-validator';
import { LeaveStatus } from '../entities/leave.entity';

export class UpdateStatusDto{

@IsEnum(LeaveStatus)
status:LeaveStatus;

}