import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  // TEMPORARY: lets anyone register as an admin. Remove before going live.
  @IsOptional()
  @IsIn(['User', 'Admin'])
  role?: 'User' | 'Admin';

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password!: string;
}
