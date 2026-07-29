import { IsNotEmpty, IsIn } from 'class-validator';

export class MilestoneApprovalDto {
  @IsNotEmpty()
  @IsIn(['Approved', 'Rejected'])
  status: 'Approved' | 'Rejected';
}