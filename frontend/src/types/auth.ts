export type LoginRequest = {
  email: string;
  password: string;
};

export type UserRole = "User" | "Admin";

export type RegisterRequest = {
  email: string;
  password: string;
  role?: UserRole;
};

export type AuthResponse = {
  token: string;
  email: string;
  role: string;
  userId: number;
};