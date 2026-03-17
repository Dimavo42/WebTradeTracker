export type TradeType = 'Open' | 'Close';

export interface Trade {
  id: number;
  stockId: number;
  symbol: string;
  tradeType: string;
  quantity: number;
  entryPrice: number;
  exitPrice: number | null;
  entryDate: string;
  exitDate: string | null;
  status: 'Open' | 'Closed';
  fees: number | null;
  notes: string | null;
  createdAt: string;
}
