import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  MarketFilterOptionsDto,
  MarketStockDto,
  PricePointDto,
} from './dto/marketStock.dto';
import {
  MarketStockFilterDto,
  RESULT_LIMITS,
} from './dto/marketStockFilter.dto';
import {
  COUNTRIES,
  MAX_SCREENER_SIZE,
  SECTORS,
  fetchHistory,
  fetchQuotes,
  screenStocks,
} from '../common/scripts/yahooFinance';

const MAX_QUOTE_SYMBOLS = 50;

@Injectable()
export class MarketService {
  async searchStocks(filters: MarketStockFilterDto): Promise<MarketStockDto[]> {
    if (filters.sector && filters.type !== 'stock') {
      throw new BadRequestException([
        'sector can only be used when type is stock',
      ]);
    }

    const search = filters.search?.trim().toLowerCase();

    try {
      // A search looks through the country's top results, not just the
      // first `limit` of them, then returns up to `limit` matches.
      const stocks = await screenStocks({
        country: filters.country,
        type: filters.type,
        sector: filters.sector,
        size: search ? MAX_SCREENER_SIZE : filters.limit,
      });

      const matches = search
        ? stocks.filter(
            (s) =>
              s.symbol.toLowerCase().includes(search) ||
              s.companyName.toLowerCase().includes(search),
          )
        : stocks;

      return matches.slice(0, filters.limit);
    } catch (error) {
      console.error('Failed to screen stocks:', error);
      throw new InternalServerErrorException(
        'Failed to fetch stocks from Yahoo Finance',
      );
    }
  }

  getFilterOptions(): MarketFilterOptionsDto {
    return {
      countries: COUNTRIES.map(({ code, name }) => ({ code, name })),
      types: [
        { value: 'stock', label: 'Stocks' },
        { value: 'etf', label: 'ETFs' },
        { value: 'bond', label: 'Bond ETFs' },
      ],
      sectors: [...SECTORS],
      limits: RESULT_LIMITS,
    };
  }

  async getQuotes(symbolsParam: string | undefined): Promise<MarketStockDto[]> {
    const symbols = [
      ...new Set(
        (symbolsParam ?? '')
          .split(',')
          .map((s) => s.trim().toUpperCase())
          .filter(Boolean),
      ),
    ];

    if (symbols.length > MAX_QUOTE_SYMBOLS) {
      throw new BadRequestException([
        `symbols can contain at most ${MAX_QUOTE_SYMBOLS} symbols`,
      ]);
    }

    try {
      return await fetchQuotes(symbols);
    } catch (error) {
      console.error('Failed to fetch quotes:', error);
      throw new InternalServerErrorException('Failed to fetch quotes');
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
