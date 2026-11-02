import { ENV } from "../common/env";

const BASE_URL = `${ENV.BASE_URL}/journal/stocks`;

export type UserStockResponse = {
  id: number;
  symbol: string;
  companyName: string;
  entryPrice: number;
  quantity: number;
};

export type SaveUserStockRequest = {
  companyName?: string;
  entryPrice: number;
  quantity: number;
};

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

export async function getStocks(token: string): Promise<UserStockResponse[]> {
  const response = await fetch(BASE_URL, { headers: getAuthHeaders(token) });

  if (!response.ok) {
    return throwResponseError(response);
  }

  return response.json();
}

export async function saveStock(
  symbol: string,
  data: SaveUserStockRequest,
  token: string
): Promise<UserStockResponse> {
  const response = await fetch(`${BASE_URL}/${encodeURIComponent(symbol)}`, {
    method: "PUT",
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    return throwResponseError(response);
  }

  return response.json();
}

export async function deleteStock(symbol: string, token: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${encodeURIComponent(symbol)}`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
  });

  // 404 means it was already gone, which is what we wanted
  if (!response.ok && response.status !== 404) {
    return throwResponseError(response);
  }
}
