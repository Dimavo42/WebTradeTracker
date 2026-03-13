export type Trade = {
  id: number;
  stockId: number;
  stockSymbol: string;
  quantity: number;
  price: number;
  status: string;
  tradeType: string;
  tradeDate: string;
  fees: number;
};

export type CreateTradeRequest = {
  stockSymbol: string;
  tradeType: string;
  quantity: number;
  price: number;
  tradeDate: string;
};
