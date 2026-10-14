import YahooFinance from 'yahoo-finance2';
import { MarketStockDto } from '../../market/dto/marketStock.dto';

const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

export const DEFAULT_SYMBOLS = [
  'AAPL',
  'MSFT',
  'NVDA',
  'GOOGL',
  'AMZN',
  'META',
  'TSLA',
  'BRK-B',
  'AVGO',
  'JPM',
  'LLY',
  'V',
  'UNH',
  'XOM',
  'MA',
  'JNJ',
  'PG',
  'HD',
  'COST',
  'ABBV',
  'WMT',
  'NFLX',
  'CRM',
  'BAC',
  'KO',
  'ORCL',
  'CVX',
  'MRK',
  'AMD',
  'PEP',
  'ADBE',
  'TMO',
  'CSCO',
  'ACN',
  'MCD',
  'LIN',
  'ABT',
  'DIS',
  'WFC',
  'INTC',
  'QCOM',
  'IBM',
  'TXN',
  'CAT',
  'GE',
  'NKE',
  'PFE',
  'UBER',
  'PYPL',
  'BA',
];

const CACHE_TTL_MS = 60_000;

let cache: { data: MarketStockDto[]; fetchedAt: number } | null = null;

// yahoo-finance2's Quote type has a [key: string]: any index signature,
// so its fields read as `any`; these narrow them to real types.
function toStr(value: unknown): string | null {
  return typeof value === 'string' ? value : null;
}

function toNum(value: unknown): number | null {
  return typeof value === 'number' ? value : null;
}

export async function fetchDefaultStocks(): Promise<MarketStockDto[]> {
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
    return cache.data;
  }

  const quotes = await yahooFinance.quote(DEFAULT_SYMBOLS);

  const data: MarketStockDto[] = quotes.map((q) => ({
    symbol: toStr(q.symbol) ?? '',
    companyName: toStr(q.longName) ?? toStr(q.shortName) ?? '',
    exchange: toStr(q.fullExchangeName),
    currency: toStr(q.currency),
    price: toNum(q.regularMarketPrice),
    change: toNum(q.regularMarketChange),
    changePercent: toNum(q.regularMarketChangePercent),
    marketCap: toNum(q.marketCap),
  }));

  cache = { data, fetchedAt: Date.now() };

  return data;
}
