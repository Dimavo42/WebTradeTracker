export type Trade = {
  id: number;
  symbol: string;
  quantity: number;
  entryPrice: number;
  status: string;
  entryDate: string;
};

export type CreateTradeRequest = {
  symbol: string;
  quantity: number;
  entryPrice: number;
  status: string;
  entryDate: string;
};