export type TradeType = 'Buy' | 'Sell';

export type TradeStatus = 'Open' | 'Closed';

export interface Trade {
  id: number;
  stockId: number;
  symbol: string;
  tradeType: TradeType;
  quantity: number;
  entryPrice: number;
  exitPrice: number | null;
  entryDate: string;
  exitDate: string | null;
  status: TradeStatus;
  fees: number | null;
  notes: string | null;
  createdAt: string;
}
