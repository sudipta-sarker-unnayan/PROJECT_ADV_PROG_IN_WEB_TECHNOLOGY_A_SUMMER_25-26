import { IsString, IsDateString, IsNumber } from 'class-validator';

export class CreateLeaveDto {

    @IsString()
    reason: string;

    @IsDateString()
    startDate: string;

    @IsDateString()
    endDate: string;

    @IsNumber()
    employeeId: number;

}