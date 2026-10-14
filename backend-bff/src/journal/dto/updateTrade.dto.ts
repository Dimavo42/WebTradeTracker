import { TradeStatus } from '../types/trade.types';

export interface UpdateTradeDto {
  quantity: number;
  price: number;
  fees?: number;
  status: TradeStatus;
  tradeDate: string;
}
