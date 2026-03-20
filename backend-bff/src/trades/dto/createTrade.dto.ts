import { TradeType } from '../types/trade.types';

export interface CreateTradeDto {
  stockSymbol: string;
  quantity: number;
  tradeType: TradeType;
  price: number;
  tradeDate: string;
}
