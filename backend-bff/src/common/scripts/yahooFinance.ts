import YahooFinance from 'yahoo-finance2';
import {
  MarketStockDto,
  PricePointDto,
} from '../../market/dto/marketStock.dto';

const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

// Yahoo's "region" is where a stock is listed, not where the company is
// based. Limiting each country to its main exchange(s) removes duplicate
// listings (e.g. RELIANCE.BO and RELIANCE.NS).
export const COUNTRIES = [
  {
    code: 'US',
    name: 'United States',
    region: 'us',
    exchanges: ['NMS', 'NYQ', 'NGM', 'NCM', 'ASE', 'PCX', 'BTS'],
  },
  { code: 'IL', name: 'Israel', region: 'il', exchanges: ['TLV'] },
  { code: 'GB', name: 'United Kingdom', region: 'gb', exchanges: ['LSE'] },
  { code: 'DE', name: 'Germany', region: 'de', exchanges: ['GER'] },
  { code: 'JP', name: 'Japan', region: 'jp', exchanges: ['JPX'] },
  { code: 'CA', name: 'Canada', region: 'ca', exchanges: ['TOR'] },
  { code: 'IN', name: 'India', region: 'in', exchanges: ['NSI'] },
  { code: 'CN', name: 'China', region: 'cn', exchanges: ['SHH', 'SHZ'] },
] as const;

export type CountryCode = (typeof COUNTRIES)[number]['code'];

export const SECTORS = [
  'Basic Materials',
  'Communication Services',
  'Consumer Cyclical',
  'Consumer Defensive',
  'Energy',
  'Financial Services',
  'Healthcare',
  'Industrials',
  'Real Estate',
  'Technology',
  'Utilities',
] as const;

export const ASSET_TYPES = ['stock', 'etf', 'bond'] as const;

export type AssetType = (typeof ASSET_TYPES)[number];

// Yahoo has no "bond" asset type, so bonds are ETFs in a bond category.
// These are Morningstar categories, which Yahoo mostly has for US funds.
const BOND_CATEGORIES = [
  'Intermediate Core Bond',
  'Intermediate Core-Plus Bond',
  'Short-Term Bond',
  'Ultrashort Bond',
  'Long-Term Bond',
  'Corporate Bond',
  'High Yield Bond',
  'Inflation-Protected Bond',
  'Intermediate Government',
  'Short Government',
  'Long Government',
  'Muni National Short',
  'Muni National Interm',
  'Multisector Bond',
  'Global Bond',
  'World Bond',
  'Emerging Markets Bond',
  'Bank Loan',
  'Nontraditional Bond',
];

export const MAX_SCREENER_SIZE = 250;

const CACHE_TTL_MS = 60_000;

const screenerCache = new Map<
  string,
  { data: MarketStockDto[]; fetchedAt: number }
>();

// yahoo-finance2's Quote type has a [key: string]: any index signature,
// so its fields read as `any`; these narrow them to real types.
function toStr(value: unknown): string | null {
  return typeof value === 'string' ? value : null;
}

function toNum(value: unknown): number | null {
  return typeof value === 'number' ? value : null;
}

function toMarketStock(q: Record<string, unknown>): MarketStockDto {
  return {
    symbol: toStr(q.symbol) ?? '',
    companyName: toStr(q.longName) ?? toStr(q.shortName) ?? '',
    exchange: toStr(q.fullExchangeName),
    currency: toStr(q.currency),
    price: toNum(q.regularMarketPrice),
    change: toNum(q.regularMarketChange),
    changePercent: toNum(q.regularMarketChangePercent),
    // ETFs have no market cap; their size is net assets
    marketCap: toNum(q.marketCap) ?? toNum(q.netAssets),
    volume: toNum(q.regularMarketVolume),
  };
}

type Operand = { operator: string; operands: (string | Operand)[] };

const eq = (field: string, value: string): Operand => ({
  operator: 'EQ',
  operands: [field, value],
});

const anyOf = (field: string, values: readonly string[]): Operand => ({
  operator: 'OR',
  operands: values.map((v) => eq(field, v)),
});

// The library's screener() only supports Yahoo's predefined screens, so a
// custom screen (country + type + sector) goes through its internal _fetch,
// which handles Yahoo's cookie/crumb. The crumb must be fetched by a normal
// GET first: _fetch would otherwise send our POST options to the cookie
// request too, and Yahoo rejects it.
let crumbReady: Promise<unknown> | null = null;

async function postScreener(body: object): Promise<Record<string, unknown>[]> {
  crumbReady ??= yahooFinance.quote('AAPL');
  await crumbReady;

  const response = (await yahooFinance._fetch(
    'https://${YF_QUERY_HOST}/v1/finance/screener',
    {},
    {
      fetchOptions: {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      },
    },
    'json',
    true,
  )) as {
    finance?: {
      result?: { quotes?: Record<string, unknown>[] }[] | null;
      error?: { description?: string } | null;
    };
  };

  if (response.finance?.error) {
    throw new Error(response.finance.error.description ?? 'Screener failed');
  }

  return response.finance?.result?.[0]?.quotes ?? [];
}

export async function screenStocks(options: {
  country: CountryCode;
  type: AssetType;
  sector?: string;
  size: number;
}): Promise<MarketStockDto[]> {
  const key = JSON.stringify(options);
  const cached = screenerCache.get(key);

  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return cached.data;
  }

  const country = COUNTRIES.find((c) => c.code === options.country)!;
  const operands: Operand[] = [
    eq('region', country.region),
    anyOf('exchange', country.exchanges),
  ];

  if (options.type === 'stock' && options.sector) {
    operands.push(eq('sector', options.sector));
  }

  if (options.type === 'bond') {
    operands.push(anyOf('categoryname', BOND_CATEGORIES));
  }

  const quotes = await postScreener({
    size: options.size,
    offset: 0,
    sortField: options.type === 'stock' ? 'intradaymarketcap' : 'fundnetassets',
    sortType: 'DESC',
    quoteType: options.type === 'stock' ? 'EQUITY' : 'ETF',
    query: { operator: 'AND', operands },
    userId: '',
    userIdType: 'guid',
  });

  const data = quotes.map(toMarketStock);
  screenerCache.set(key, { data, fetchedAt: Date.now() });

  return data;
}

export async function fetchQuotes(
  symbols: string[],
): Promise<MarketStockDto[]> {
  if (symbols.length === 0) return [];

  const quotes = await yahooFinance.quote(symbols);

  return quotes.map((q) => toMarketStock(q));
}

const HISTORY_YEARS = 5;

export async function fetchHistory(symbol: string): Promise<PricePointDto[]> {
  const period1 = new Date();
  period1.setFullYear(period1.getFullYear() - HISTORY_YEARS);

  const result = await yahooFinance.chart(symbol, {
    period1,
    interval: '1wk',
  });

  return result.quotes
    .filter((q) => q.close !== null)
    .map((q) => ({
      date: q.date.toISOString(),
      close: q.close as number,
    }));
}
