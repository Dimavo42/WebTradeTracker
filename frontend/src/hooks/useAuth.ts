import { useEffect, useState } from "react";
import { login as loginApi, loginWithGoogle, register as registerApi } from "../api/authApi";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "../types/auth";

function getErrorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback;
}


function getExpiredTokenTime(token:string):number{
  const payload  = token.split('.')[1];
  const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
  const decoded = atob(base64);
  const { exp } = JSON.parse(decoded);
   if (typeof exp !== "number") {
    throw new Error("Token has no expiration");
  }
  return exp * 1000; // Convert to milliseconds
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
 

  const loginWithGoogleMock = async ():Promise<AuthResponse>=>{
    setLoading(true);
    setError(null);
    let popup: Window | null = null;
    try {
      const width = 500;
      const height = 600;
      const left = window.screenX + (window.innerWidth - width) / 2;
      const top = window.screenY + (window.innerHeight - height) / 2;
      popup = window.open(
        'about:blank',
        'google-login-mock',
        `width=${width},height=${height},left=${left},top=${top}`
      );
      // The popup is only for show; a blocked popup must not stop the mock login
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 1000); // Simulate a delay for the popup to open
      });
      return await loginWithGoogle();
    } catch (err) {
      const message = getErrorMessage(err, "Mock Google login failed");
      setError(message);
      throw err;
    } finally {
      popup?.close();
      setLoading(false);
    }
  }

  return {
    login,
    register,
    loginWithGoogleMock,
    loading,
    error,
    clearError: () => setError(null),
  };
}


export function useAuthExpiration(token: string | null, onExpire: () => void) {

  useEffect(()=>{
    if(!token) return;
    let expirationTime:number;
    try{
      expirationTime = getExpiredTokenTime(token);
    }catch{
      onExpire();
      return;
    }
    let timer: ReturnType<typeof setTimeout>;
    const checkExpiration = () => {
      const remaining = expirationTime - Date.now();
      if (remaining <= 0) {
        onExpire();
        return;
      }
      // Browser timers have a maximum supported delay.
      timer = setTimeout(checkExpiration, Math.min(remaining, 2_147_483_647));
    };
    checkExpiration();
    return () =>clearTimeout(timer);

  },[token,onExpire]);



  
}