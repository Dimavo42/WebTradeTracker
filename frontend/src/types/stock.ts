export type Stock = {
  id: number;
  symbol: string;
  companyName: string;
  exchange: string | null;
  sector: string | null;
  createdAt: string;
};

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

export type CreateStockDto = {
  symbol: string;
  companyName: string;
};