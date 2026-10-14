import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MarketStockDto } from './dto/marketStock.dto';
import { fetchDefaultStocks } from '../common/scripts/yahooFinance';

@Injectable()
export class MarketService {
  async getDefaultStocks(): Promise<MarketStockDto[]> {
    try {
      return await fetchDefaultStocks();
    } catch {
      throw new InternalServerErrorException(
        'Failed to fetch stocks from Yahoo Finance',
      );
    }
  }
}
