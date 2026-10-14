import { ENV } from "../common/env";
import type { CreateTradeRequest, Trade, UpdateTradeRequest } from "../types/trade";

const BASE_URL = `${ENV.BASE_URL}/journal/trades`;

function getAuthHeaders(token: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function throwResponseError(response: Response): Promise<never> {
  const errorText = await response.text();
  let message = errorText;

  try {
    message = (JSON.parse(errorText) as { message?: string }).message ?? errorText;
  } catch {
    // not JSON, use the raw text
  }

  throw new Error(message || `HTTP error ${response.status}`);
}

export async function getTrades(token: string): Promise<Trade[]> {
  const response = await fetch(BASE_URL, {
    headers: getAuthHeaders(token),
  });

  if (!response.ok) {
    return throwResponseError(response);
  }

  return response.json();
}

export async function createTrade(
  data: CreateTradeRequest,
  token: string
): Promise<void> {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    return throwResponseError(response);
  }
}

export async function updateTrade(trade: Trade, token: string): Promise<void> {
  const request: UpdateTradeRequest = {
    quantity: trade.quantity,
    price: trade.entryPrice,
    fees: trade.fees ?? undefined,
    status: trade.status,
    tradeDate: trade.entryDate,
  };

  const response = await fetch(`${BASE_URL}/${trade.id}`, {
    method: "PUT",
    headers: getAuthHeaders(token),
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    return throwResponseError(response);
  }
}

export async function deleteTradesBySymbol(
  symbol: string,
  token: string
): Promise<void> {
  const response = await fetch(`${BASE_URL}/symbol/${encodeURIComponent(symbol)}`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
  });

  if (!response.ok) {
    return throwResponseError(response);
  }
}
