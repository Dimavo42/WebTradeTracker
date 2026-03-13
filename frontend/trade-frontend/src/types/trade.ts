export type Trade = {
  id: number;
  stockId: number;
  symbol: string;
  tradeType: string;
  quantity: number;
  entryPrice: number;
  exitPrice: number | null;
  entryDate: string;
  exitDate: string | null;
  status: string;
  fees: number | null;
  notes: string | null;
  createdAt: string;
};

export type CreateTradeRequest = {
  stockSymbol: string;
  tradeType: string;
  quantity: number;
  price: number;
  tradeDate: string;
};
