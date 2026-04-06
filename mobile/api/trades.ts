import { apiFetch } from './client';
import type { CreateTradeDto, Trade } from './types';

export function getTrades(): Promise<Trade[]> {
  return apiFetch<Trade[]>('trade');
}

export function createTrade(payload: CreateTradeDto): Promise<Trade> {
  return apiFetch<Trade>('trade', {
    method: 'POST',
    body: payload,
  });
}

export function updateTrade(id: number, payload: CreateTradeDto): Promise<Trade> {
  return apiFetch<Trade>(`trade/${id}`, {
    method: 'PUT',
    body: payload,
  });
}

export function deleteTradeBySymbol(symbol: string): Promise<void> {
  return apiFetch<void>(`trade/symbol/${encodeURIComponent(symbol)}`, {
    method: 'DELETE',
  });
}
