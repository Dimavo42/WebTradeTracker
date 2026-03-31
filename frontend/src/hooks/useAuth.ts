import { useState } from "react";
import { login as loginApi, register as registerApi } from "../api/authApi";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "../types/auth";

function getErrorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback;
}

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (data: LoginRequest): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);

    try {
      return await loginApi(data);
    } catch (err: unknown) {
      const message = getErrorMessage(err, "Login failed");
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterRequest): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);

    try {
      return await registerApi(data);
    } catch (err: unknown) {
      const message = getErrorMessage(err, "Register failed");
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    register,
    loading,
    error,
    clearError: () => setError(null),
  };
}