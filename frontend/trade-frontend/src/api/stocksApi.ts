import type { CreateStockDto, Stock } from "../types/stock";

const API_BASE_URL = "http://localhost:3001/api/stocks";

function getAuthHeaders(token: string | null): HeadersInit {
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getStocks(token: string): Promise<Stock[]> {
  const response = await fetch(API_BASE_URL, {
    method: "GET",
    headers: getAuthHeaders(token),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch stocks: ${response.status}`);
  }

  return response.json();
}

export async function getStockById(id: number,token: string): Promise<Stock> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "GET",
    headers: getAuthHeaders(token),
  });

  if (response.status === 404) {
    throw new Error("Stock not found");
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch stock: ${response.status}`);
  }

  return response.json();
}

export async function createStock(dto: CreateStockDto,token: string): Promise<Stock> {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    throw new Error(`Failed to create stock: ${response.status}`);
  }

  return response.json();
}

export async function deleteStock(id: number,token: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
  });

  if (response.status === 404) {
    throw new Error("Stock not found");
  }

  if (!response.ok) {
    throw new Error(`Failed to delete stock: ${response.status}`);
  }
}