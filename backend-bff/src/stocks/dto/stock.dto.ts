export interface StockDto {
  id: number;
  symbol: string;
  companyName: string;
  exchange: string | null;
  sector: string | null;
  createdAt: string;
}
