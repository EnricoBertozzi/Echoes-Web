import type { PropsWithChildren } from "react";
import { useLocation, Navigate } from "react-router";
import { useAuth } from "~/context/AuthContext";
import { LoadingPage } from "../../../pages/LoadingPage";

export default function ManagerLayout({ children }: PropsWithChildren) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingPage />;
  }

  if (!user) {
    return <Navigate to="/unathorized" replace state={{ from: location }} />;
  }

  if (user.role != "MANAGER") {
    return <Navigate to="/forbidden" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
