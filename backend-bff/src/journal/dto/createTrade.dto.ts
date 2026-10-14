import { TradeStatus, TradeType } from '../types/trade.types';

export interface CreateTradeDto {
  stockSymbol: string;
  quantity: number;
  tradeType: TradeType;
  status: TradeStatus;
  price: number;
  fees: number;
  tradeDate: string;
}
