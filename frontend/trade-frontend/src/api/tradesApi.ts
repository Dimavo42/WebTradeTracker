import type { CreateTradeRequest, Trade } from "../types/trade";

const BASE_URL = "http://localhost:5000/api/trade";

export async function getTrades(): Promise<Trade[]> {
  const response = await fetch(BASE_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch trades");
  }

  return response.json();
}

export async function createTrade(data: CreateTradeRequest): Promise<Trade> {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create trade");
  }

  return response.json();
}

export async function deleteTradeById(id: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete trade");
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
