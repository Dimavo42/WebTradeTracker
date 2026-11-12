import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthResponse } from "../../types/auth";

type Role = "admin" | "user" | null;

type AuthState = {
  token: string | null;
  isAuthenticated: boolean;
  role: Role;
  email: string | null;
};

// The .NET API sends "Admin" / "User" — normalize so comparisons are case-insensitive
function toRole(value: string | null): Role {
  const role = value?.toLowerCase();
  return role === "admin" || role === "user" ? role : null;
}

const initialState: AuthState = {
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),
  role: toRole(localStorage.getItem("role")),
  email: localStorage.getItem("email"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<AuthResponse>) {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.role = toRole(action.payload.role);
      state.email = action.payload.email;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("role", action.payload.role);
      localStorage.setItem("email", action.payload.email);
    },
    logout(state) {
      state.token = null;
      state.isAuthenticated = false;
      state.role = null;
      state.email = null;
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("email");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
