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
  quantity: number;
  tradeType: "Buy" | "Sell";
  status: "Open" | "Closed";
  price: number;
  fees: number;
  tradeDate: string;
};


export type UpdateTradeRequest = {
  quantity: number;
  price: number;
  fees?: number;
  status: "Open" | "Closed";
  tradeDate: string;
};
