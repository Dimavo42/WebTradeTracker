import { Platform } from 'react-native';

const LOCAL_BFF_HOST = 'localhost:3000';
const ANDROID_EMULATOR_HOST = '10.0.2.2:3000';

const host = Platform.OS === 'android' ? ANDROID_EMULATOR_HOST : LOCAL_BFF_HOST;
export const API_BASE_URL = `http://${host}/api`;

export interface ApiError {
  status: number;
  message: string;
  details?: unknown;
}

interface ApiFetchOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

async function parseJsonResponse(response: Response) {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const cleanedPath = path.replace(/^\//, '');
  const url = `${API_BASE_URL}/${cleanedPath}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers ?? {}),
  } as Record<string, string>;

  const response = await fetch(url, {
    ...options,
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const data = await parseJsonResponse(response);

  if (!response.ok) {
    const message = typeof data === 'object' && data !== null && 'message' in data
      ? (data as any).message
      : response.statusText;

    const error: ApiError = {
      status: response.status,
      message: String(message),
      details: data,
    };

    throw error;
  }

  return data as T;
}

export async function authFetch<T>(path: string, token: string, options: ApiFetchOptions = {}): Promise<T> {
  return apiFetch<T>(path, {
    ...options,
    headers: {
      ...(options.headers ?? {}),
      Authorization: `Bearer ${token}`,
    },
  });
}
