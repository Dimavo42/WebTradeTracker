import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MarketStockDto, PricePointDto } from './dto/marketStock.dto';
import {
  fetchDefaultStocks,
  fetchHistory,
} from '../common/scripts/yahooFinance';

@Injectable()
export class MarketService {
  async getDefaultStocks(): Promise<MarketStockDto[]> {
    try {
      return await fetchDefaultStocks();
    } catch (error) {
      console.error('Failed to fetch default stocks:', error);
      throw new InternalServerErrorException(
        'Failed to fetch stocks from Yahoo Finance',
      );
    }
  }

  async getHistory(symbol: string): Promise<PricePointDto[]> {
    try {
      return await fetchHistory(symbol.toUpperCase());
    } catch (error) {
      console.error(`Failed to fetch history for ${symbol}:`, error);
      throw new InternalServerErrorException(
        `Failed to fetch price history for ${symbol}`,
      );
    }
  }
}
