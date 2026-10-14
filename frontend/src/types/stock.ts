export type MarketStock = {
  symbol: string;
  companyName: string;
  exchange: string | null;
  currency: string | null;
  price: number | null;
  change: number | null;
  changePercent: number | null;
  marketCap: number | null;
};

export type PricePoint = {
  date: string;
  close: number;
};
