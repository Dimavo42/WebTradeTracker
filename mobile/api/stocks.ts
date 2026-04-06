import { authFetch, apiFetch } from './client';
import type { CreateStockDto, StockDto } from './types';

export function getStocks(token: string): Promise<StockDto[]> {
  return authFetch<StockDto[]>('stocks', token);
}

export function getStockById(token: string, id: number): Promise<StockDto> {
  return authFetch<StockDto>(`stocks/${id}`, token);
}

export function createStock(token: string, payload: CreateStockDto): Promise<StockDto> {
  return authFetch<StockDto>('stocks', token, {
    method: 'POST',
    body: payload,
  });
}

export function deleteStock(token: string, id: number): Promise<void> {
  return authFetch<void>(`stocks/${id}`, token, {
    method: 'DELETE',
  });
}
