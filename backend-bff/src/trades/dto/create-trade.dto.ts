import { TradeType } from '../types/trade.types';

export class CreateTradeDto {
  stockSymbol: string;
  quantity: number;
  tradeType: TradeType;
  price: number;
  tradeDate: string;
}
