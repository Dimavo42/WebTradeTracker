export type TradeType = 'Open' | 'Close';

export interface Trade {
  id: number;
  stockSymbol: string;
  quantity: number;
  tradeType: TradeType;
  price: number;
  tradeDate: string;
}
