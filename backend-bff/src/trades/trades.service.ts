import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Trade } from './types/trade.types';
import { CreateTradeDto } from './dto/createTrade.dto';
import { UpdateTradeDto } from './dto/updateTrade.dto';

@Injectable()
export class TradesService {
  constructor(private readonly httpService: HttpService) {}

  private readonly backendUrl =
    process.env.DOTNET_API_URL || 'http://backend:8080';

  async getTrades(): Promise<Trade[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<Trade[]>(`${this.backendUrl}/api/trade`),
      );

      return response.data;
    } catch (error) {
      console.error('Failed to fetch trades:', error);
      throw new InternalServerErrorException('Failed to fetch trades');
    }
  }

  async createTrade(tradeDto: CreateTradeDto): Promise<Trade> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<Trade>(`${this.backendUrl}/api/trade`, tradeDto),
      );

      return response.data;
    } catch (error) {
      console.error('Failed to create trade:', error);
      throw new InternalServerErrorException('Failed to create trade');
    }
  }

  async updateTrade(id: number, tradeDto: UpdateTradeDto): Promise<Trade> {
    try {
      const response = await firstValueFrom(
        this.httpService.put<Trade>(
          `${this.backendUrl}/api/trade/${id}`,
          tradeDto,
        ),
      );

      return response.data;
    } catch (error) {
      console.error('Failed to update trade:', error);
      throw new InternalServerErrorException('Failed to update trade');
    }
  }

  async deleteTradeBySymbol(symbol: string): Promise<void> {
    try {
      await firstValueFrom(
        this.httpService.delete(
          `${this.backendUrl}/api/trade/symbol/${symbol}`,
        ),
      );
    } catch (error) {
      console.error('Failed to delete trade:', error);
      throw new InternalServerErrorException('Failed to delete trade');
    }
  }
}
