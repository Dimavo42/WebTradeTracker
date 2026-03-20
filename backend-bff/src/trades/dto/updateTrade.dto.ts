import { TradeType } from '../types/trade.types';

export interface UpdateTradeDto {
  stockSymbol?: string;
  quantity?: number;
  tradeType?: TradeType;
  price?: number;
  tradeDate?: string;
}
