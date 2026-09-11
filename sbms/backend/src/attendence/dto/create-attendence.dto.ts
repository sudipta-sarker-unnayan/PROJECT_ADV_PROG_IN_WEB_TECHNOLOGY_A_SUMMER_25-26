import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"
import { AttendenceStatus } from "../entities/attendence.entity"

export class CreateAttendenceDto {
    @IsDateString()
    date:Date

    @IsString()
    @IsNotEmpty()
    checkIn:string

    @IsOptional()
    @IsString()
    checkOut:string

    @IsOptional()
    status?:AttendenceStatus

    @IsNumber()
    employeeId:number
}
