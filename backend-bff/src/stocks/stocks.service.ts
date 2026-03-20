import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { StockDto } from './dto/stock.dto';
import { AxiosError } from 'axios';
import { DeleteStockResponseDto } from './dto/deleteStockResponse.dto';
import { CreateStockDto } from './dto/createStock.dto';

@Injectable()
export class StocksService {
  constructor(private readonly httpService: HttpService) {}

  private readonly backendUrl =
    process.env.DOTNET_API_URL || 'http://backend:8080';

  async getStocks(token: string): Promise<StockDto[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<StockDto[]>(`${this.backendUrl}/api/stocks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      );

      return response.data;
    } catch (error: unknown) {
      this.handleHttpError(error);
    }
  }

  async getStockById(id: number, token: string): Promise<StockDto> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<StockDto>(`${this.backendUrl}/api/stocks/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      );

      return response.data;
    } catch (error: unknown) {
      this.handleHttpError(error);
    }
  }

  async createStock(dto: CreateStockDto, token: string): Promise<StockDto> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<StockDto>(`${this.backendUrl}/api/stocks`, dto, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      );

      return response.data;
    } catch (error: unknown) {
      this.handleHttpError(error);
    }
  }

  async deleteStock(
    id: number,
    token: string,
  ): Promise<DeleteStockResponseDto> {
    try {
      await firstValueFrom(
        this.httpService.delete<void>(`${this.backendUrl}/api/stocks/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      );

      return { success: true };
    } catch (error: unknown) {
      this.handleHttpError(error);
    }
  }

  private handleHttpError(error: unknown): never {
    const axiosError = error as AxiosError<{ message?: string }>;

    if (axiosError.response?.status === 404) {
      throw new NotFoundException(
        axiosError.response.data?.message || 'Stock not found',
      );
    }

    if (axiosError.response?.status === 400) {
      throw new InternalServerErrorException(
        axiosError.response.data?.message || 'Bad request to backend',
      );
    }

    if (axiosError.response?.status === 401) {
      throw new InternalServerErrorException('Unauthorized backend request');
    }

    if (axiosError.response?.status === 403) {
      throw new InternalServerErrorException('Forbidden backend request');
    }

    throw new InternalServerErrorException(
      axiosError.response?.data?.message || 'Backend request failed',
    );
  }
}
