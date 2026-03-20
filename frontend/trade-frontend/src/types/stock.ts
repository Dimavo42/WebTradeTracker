export type Stock = {
  id: number;
  symbol: string;
  companyName: string;
};

export type CreateStockDto = {
  symbol: string;
  companyName: string;
};