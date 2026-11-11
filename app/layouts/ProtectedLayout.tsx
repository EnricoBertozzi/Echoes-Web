import type { PropsWithChildren } from "react";
import { useLocation, Navigate, useNavigate } from "react-router";
import { useAuth } from "~/context/AuthContext";
import { LoadingPage } from "../pages/LoadingPage";
import type React from "react";

export interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
    const { user, loading } = useAuth();
  const navigate = useNavigate()

  if (loading) {
    return <LoadingPage />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>
}
