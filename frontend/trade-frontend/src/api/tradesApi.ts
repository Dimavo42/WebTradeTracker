import type { CreateTradeRequest, Trade } from "../types/trade";

const BASE_URL = "https://localhost:7060/api/trades"; // change to your backend port

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

export async function deleteTrade(id: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete trade");
  }
}