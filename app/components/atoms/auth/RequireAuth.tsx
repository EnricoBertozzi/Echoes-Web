import type { PropsWithChildren } from "react";
import { useLocation, Navigate } from "react-router";
import { useAuth } from "~/context/AuthContext";

export function RequireAuth({ children }: PropsWithChildren) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <p>Verificando autenticação...</p>;
  }

  if (!user) {
    return (
      <Navigate
        to="/"
        replace
        state={{ from: location }}
      />
    );
  }

  return <>{children}</>;
}