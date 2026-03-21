import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/authResponseDto.dto';
import { ENV } from 'src/common/env';

type ApiErrorResponse = {
  message?: string;
};

@Injectable()
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
)
export class AuthService {
  constructor(private readonly httpService: HttpService) {}

  private readonly backendUrl = ENV.DOTNET_API_URL;

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<AuthResponseDto>(
          `${this.backendUrl}/api/auth/login`,
          dto,
        ),
      );

      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        const status = axiosError.response?.status;
        const data = axiosError.response?.data;

        if (status === 400) {
          throw new BadRequestException(data ?? { message: 'Invalid request' });
        }

        if (status === 401) {
          throw new UnauthorizedException(
            data ?? { message: 'Invalid email or password' },
          );
        }

        if (status === 409) {
          throw new ConflictException(data ?? { message: 'Conflict occurred' });
        }
      }

      console.error('Login error:', error);
      throw new InternalServerErrorException('Failed to login');
    }
  }

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<AuthResponseDto>(
          `${this.backendUrl}/api/auth/register`,
          dto,
        ),
      );

      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        const status = axiosError.response?.status;
        const data = axiosError.response?.data;

        if (status === 400) {
          throw new BadRequestException(data ?? { message: 'Invalid request' });
        }

        if (status === 401) {
          throw new UnauthorizedException(data ?? { message: 'Unauthorized' });
        }

        if (status === 409) {
          throw new ConflictException(
            data ?? { message: 'User already exists' },
          );
        }
      }

      console.error('Register error:', error);
      throw new InternalServerErrorException('Failed to register');
    }
  }
}
