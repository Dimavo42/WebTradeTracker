import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { Trade } from './types/trade.types';
import { CreateTradeDto } from './dto/createTrade.dto';
import { UpdateTradeDto } from './dto/updateTrade.dto';
import { SaveUserStockDto } from './dto/saveUserStock.dto';
import { UserStock } from './types/userStock.types';
import { ENV } from '../common/env';

@Injectable()
export class JournalService {
  constructor(private readonly httpService: HttpService) {}

  private readonly tradesUrl = `${ENV.DOTNET_API_URL}/api/trade`;

  private readonly stocksUrl = `${ENV.DOTNET_API_URL}/api/stocks`;

  async getTrades(token: string): Promise<Trade[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<Trade[]>(this.tradesUrl, this.authHeaders(token)),
      );

      return response.data;
    } catch (error: unknown) {
      this.handleHttpError(error, 'Failed to fetch trades');
    }
  }

  async createTrade(dto: CreateTradeDto, token: string): Promise<void> {
    try {
      await firstValueFrom(
        this.httpService.post(this.tradesUrl, dto, this.authHeaders(token)),
      );
    } catch (error: unknown) {
      this.handleHttpError(error, 'Failed to create trade');
    }
  }

  async updateTrade(
    id: number,
    dto: UpdateTradeDto,
    token: string,
  ): Promise<void> {
    try {
      await firstValueFrom(
        this.httpService.put(
          `${this.tradesUrl}/${id}`,
          dto,
          this.authHeaders(token),
        ),
      );
    } catch (error: unknown) {
      this.handleHttpError(error, 'Failed to update trade');
    }
  }

  async deleteTradesBySymbol(symbol: string, token: string): Promise<void> {
    try {
      await firstValueFrom(
        this.httpService.delete(
          `${this.tradesUrl}/symbol/${encodeURIComponent(symbol)}`,
          this.authHeaders(token),
        ),
      );
    } catch (error: unknown) {
      this.handleHttpError(error, 'Failed to delete trades');
    }
  }

  async getStocks(token: string): Promise<UserStock[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<UserStock[]>(
          this.stocksUrl,
          this.authHeaders(token),
        ),
      );

      return response.data;
    } catch (error: unknown) {
      this.handleHttpError(error, 'Failed to fetch selected stocks');
    }
  }

  async saveStock(
    symbol: string,
    dto: SaveUserStockDto,
    token: string,
  ): Promise<UserStock> {
    try {
      const response = await firstValueFrom(
        this.httpService.put<UserStock>(
          `${this.stocksUrl}/${encodeURIComponent(symbol)}`,
          dto,
          this.authHeaders(token),
        ),
      );

      return response.data;
    } catch (error: unknown) {
      this.handleHttpError(error, 'Failed to save selected stock');
    }
  }

  async removeStock(symbol: string, token: string): Promise<void> {
    try {
      await firstValueFrom(
        this.httpService.delete(
          `${this.stocksUrl}/${encodeURIComponent(symbol)}`,
          this.authHeaders(token),
        ),
      );
    } catch (error: unknown) {
      this.handleHttpError(error, 'Failed to remove selected stock');
    }
  }

  private authHeaders(token: string) {
    return { headers: { Authorization: `Bearer ${token}` } };
  }

  private handleHttpError(error: unknown, fallbackMessage: string): never {
    const axiosError = error as AxiosError<string | { message?: string }>;
    const data = axiosError.response?.data;
    const message =
      (typeof data === 'string' ? data : data?.message) || fallbackMessage;

    if (axiosError.response?.status === 400) {
      throw new BadRequestException(message);
    }

    if (axiosError.response?.status === 404) {
      throw new NotFoundException(message);
    }

    throw new InternalServerErrorException(fallbackMessage);
  }
}
