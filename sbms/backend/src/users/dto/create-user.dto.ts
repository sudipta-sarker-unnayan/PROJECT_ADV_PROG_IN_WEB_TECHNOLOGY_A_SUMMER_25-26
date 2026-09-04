import {
  IsEmail,
  IsEnum,
  IsInt,
  IsString,
  MinLength,
} from 'class-validator';
import { RoleName } from '../../roles/entities/role.entity';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(RoleName)
  role: RoleName;
}
