import { Controller, Get } from '@nestjs/common';
import { MarketService } from './market.service';
import { MarketStockDto } from './dto/marketStock.dto';

@Controller('market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Get('stocks')
  async getDefaultStocks(): Promise<MarketStockDto[]> {
    return this.marketService.getDefaultStocks();
  }
}
