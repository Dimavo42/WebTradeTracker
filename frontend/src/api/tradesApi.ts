import { ENV } from "../common/env";
import type { CreateTradeRequest, Trade, UpdateTradeRequest } from "../types/trade";

const BASE_URL = `${ENV.BASE_URL}/trade`;

export async function getTrades(): Promise<Trade[]> {
  const response = await fetch(BASE_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch trades");
  }

  return response.json();
}

export async function createTrade(data: CreateTradeRequest): Promise<void> {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `HTTP error ${response.status}`);
  }
}

export async function deleteTradeById(id: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete trade");
  }
}

export async function updateTradeFromModel(trade: Trade): Promise<void> {
  const request: UpdateTradeRequest = {
    quantity: trade.quantity,
    price: trade.entryPrice,
    fees: trade.fees ?? undefined,
    status: trade.status,
    tradeDate: trade.createdAt,
  };

  const response = await fetch(`${BASE_URL}/${trade.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `HTTP error ${response.status}`);
  }
}

export async function deleteTradesBySymbol(symbol: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/symbol/${symbol}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete trades");
  }
}