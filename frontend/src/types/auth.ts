export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type AuthResponse = {
  token: string;
  email: string;
  username: string;
  role: string;
};