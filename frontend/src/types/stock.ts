export type MarketStock = {
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
};

export type AssetType = "stock" | "etf" | "bond";

// Query for GET /market/stocks/search
export type MarketStockFilters = {
  search?: string;
  country: string;
  type: AssetType;
  sector?: string;
  limit: number;
};

export type MarketFilterOptions = {
  countries: { code: string; name: string }[];
  types: { value: AssetType; label: string }[];
  sectors: string[];
  limits: number[];
};

export type PricePoint = {
  date: string;
  close: number;
};
