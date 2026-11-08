import type { PropsWithChildren } from "react";
import { useLocation, Navigate } from "react-router";
import { useAuth } from "~/context/AuthContext";
import { LoadingPage } from "../../../pages/LoadingPage";
import { Outlet } from "react-router";

export default function ManagerLayout({ children }: PropsWithChildren) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingPage />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.role != "MANAGER") {
    return <Navigate to="/forbidden" replace />;
  }

  return <>{children}</>
}
