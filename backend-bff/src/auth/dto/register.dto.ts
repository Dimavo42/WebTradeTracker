import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  // Only honoured when ALLOW_ADMIN_SIGNUP=true (local testing). Otherwise everyone registers as User.
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
