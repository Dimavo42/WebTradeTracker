import { Controller, Get, Param, Query, ValidationPipe } from '@nestjs/common';
import { MarketService } from './market.service';
import type {
  MarketFilterOptionsDto,
  MarketStockDto,
  PricePointDto,
} from './dto/marketStock.dto';
import { MarketStockFilterDto } from './dto/marketStockFilter.dto';

@Controller('market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Get('stocks/search')
  async searchStocks(
    @Query(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        stopAtFirstError: true,
      }),
    )
    filters: MarketStockFilterDto,
  ): Promise<MarketStockDto[]> {
    return this.marketService.searchStocks(filters);
  }

  @Get('filters')
  getFilterOptions(): MarketFilterOptionsDto {
    return this.marketService.getFilterOptions();
  }

  // e.g. /api/market/quotes?symbols=AAPL,TEVA.TA
  @Get('quotes')
  async getQuotes(
    @Query('symbols') symbols: string | undefined,
  ): Promise<MarketStockDto[]> {
    return this.marketService.getQuotes(symbols);
  }

  @Get('history/:symbol')
  async getHistory(@Param('symbol') symbol: string): Promise<PricePointDto[]> {
    return this.marketService.getHistory(symbol);
  }
}
