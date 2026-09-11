import { IsString, IsDateString, IsNumber } from 'class-validator';

export class CreateLeaveDto {

    @IsString()
    reason: string;

    @IsDateString()
    startDate: Date;

    @IsDateString()
    endDate: Date;

    @IsNumber()
    employeeId: number;

}