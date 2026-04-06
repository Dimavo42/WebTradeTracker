import { apiFetch } from './client';
import type { AuthResponse, LoginPayload, RegisterPayload } from './types';

export function login(payload: LoginPayload): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('auth/login', {
    method: 'POST',
    body: payload,
  });
}

export function register(payload: RegisterPayload): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('auth/register', {
    method: 'POST',
    body: payload,
  });
}
