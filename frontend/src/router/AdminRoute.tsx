import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks/reduxHooks";

// Only admins see the page; everyone else is sent home.
// This only hides the UI — the server must still check the role for real security.
export default function AdminRoute({ children }: { children: ReactNode }) {
  const role = useAppSelector((state) => state.auth.role);
  return role === "admin" ? children : <Navigate to="/" replace />;
}
