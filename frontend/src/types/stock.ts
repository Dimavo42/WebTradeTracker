export type Stock = {
  id: number;
  symbol: string;
  companyName: string;
  exchange: string | null;
  sector: string | null;
  createdAt: string;
};

export type CreateStockDto = {
  symbol: string;
  companyName: string;
};