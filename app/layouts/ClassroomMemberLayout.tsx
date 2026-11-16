import { Navigate, Outlet } from "react-router";
import { useAuth } from "~/context/AuthContext";
import { LoadingPage } from "../pages/LoadingPage";

/** Rotas de TEACHER e STUDENT: suas turmas e o espaço de cada turma. */
export default function ClassroomMemberLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingPage />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.role !== "TEACHER" && user.role !== "STUDENT") {
    return <Navigate to="/forbidden" replace />;
  }

  return <Outlet />;
}
