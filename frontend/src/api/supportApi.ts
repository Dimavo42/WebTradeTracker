import { ENV } from "../common/env";
import type { SupportRequest } from "../types/support";

const BASE_URL = `${ENV.BASE_URL}/chatbot`;

function authHeaders(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}` };
}

async function throwResponseError(response: Response): Promise<never> {
  const text = await response.text();
  let message = text;
  try {
    message = (JSON.parse(text) as { message?: string }).message ?? text;
  } catch {
    // not JSON, use the raw text
  }
  throw new Error(message || `HTTP error ${response.status}`);
}

// Join the support queue (returns the existing entry if already waiting)
export async function callSupport(token: string): Promise<SupportRequest> {
  const response = await fetch(BASE_URL, { method: "POST", headers: authHeaders(token) });
  if (!response.ok) return throwResponseError(response);
  return response.json();
}

// The caller's waiting request, or null if they are not in the queue
export async function getMySupportRequest(token: string): Promise<SupportRequest | null> {
  const response = await fetch(`${BASE_URL}/me`, { headers: authHeaders(token) });
  if (response.status === 404) return null;
  if (!response.ok) return throwResponseError(response);
  return response.json();
}

// Everyone waiting for support, oldest first
export async function getWaitingSupport(token: string): Promise<SupportRequest[]> {
  const response = await fetch(BASE_URL, { headers: authHeaders(token) });
  if (!response.ok) return throwResponseError(response);
  return response.json();
}
