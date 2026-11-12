import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthResponse } from "../../types/auth";

type Role = 'admin' | 'user' | null;

type AuthState  = {
    token: string | null;
    isAuthenticated: boolean;
    role:Role;
};

function getRole():Role{
  const stored = localStorage.getItem("role");
  if(stored === 'admin'|| stored ==='user'){
    return stored;
  }
  return null;
}

const initialState:AuthState = {
    token:localStorage.getItem("token"),
    isAuthenticated: !!localStorage.getItem("token"),
    role:getRole(),
};



const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<AuthResponse>) {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("role", action.payload.role);
    },
    logout(state) {
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    },

  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;