import { Navigate, Outlet } from "react-router";
import { useAuth } from "~/context/AuthContext";
import { LoadingPage } from "../pages/LoadingPage";

/** Rotas de ADMIN e MANAGER (a dashboard não existe para professor e estudante). */
export default function StaffLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingPage />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.role !== "ADMIN" && user.role !== "MANAGER") {
    return <Navigate to="/forbidden" replace />;
  }

  return <Outlet />;
}
