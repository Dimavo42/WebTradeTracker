import { Controller, Get, Param } from '@nestjs/common';
import { MarketService } from './market.service';
import { MarketStockDto, PricePointDto } from './dto/marketStock.dto';

@Controller('market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Get('stocks')
  async getDefaultStocks(): Promise<MarketStockDto[]> {
    return this.marketService.getDefaultStocks();
  }

  @Get('history/:symbol')
  async getHistory(@Param('symbol') symbol: string): Promise<PricePointDto[]> {
    return this.marketService.getHistory(symbol);
  }
}
