import type { PropsWithChildren } from "react";
import { useLocation, Navigate, Outlet } from "react-router";
import { useAuth } from "~/context/AuthContext";
import { LoadingPage } from "../../../pages/LoadingPage";

export default function AdminLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingPage />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.role != "ADMIN") {
    return <Navigate to="/forbidden" replace />;
  }

  return <Outlet />;
}
