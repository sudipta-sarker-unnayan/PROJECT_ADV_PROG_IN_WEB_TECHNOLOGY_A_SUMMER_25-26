import { IsInt, IsNumber, IsOptional, Min } from "class-validator";

export class CreateManagerDto {
    @IsInt()
    userId: number;

    @IsOptional()
    @IsInt()
    departmentId?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    salary?: number;
}
