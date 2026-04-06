export interface AuthResponse {
  token: string;
  username: string;
  email: string;
  role: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
}

export interface StockDto {
  id: number;
  symbol: string;
  companyName: string;
  exchange: string | null;
  sector: string | null;
  createdAt: string;
}

export interface CreateStockDto {
  symbol: string;
  companyName: string;
}

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

export interface CreateTradeDto {
  stockSymbol: string;
  quantity: number;
  tradeType: TradeType;
  price: number;
  tradeDate: string;
}
