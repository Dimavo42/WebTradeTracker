export interface MarketStockDto {
  symbol: string;
  companyName: string;
  exchange: string | null;
  currency: string | null;
  price: number | null;
  change: number | null;
  changePercent: number | null;
  // For ETFs this is net assets
  marketCap: number | null;
  volume: number | null;
}

export interface PricePointDto {
  date: string;
  close: number;
}

export interface MarketFilterOptionsDto {
  countries: { code: string; name: string }[];
  types: { value: string; label: string }[];
  sectors: string[];
  limits: number[];
}
