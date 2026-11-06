import type { FormEvent } from "react";
import { useNavigate } from "react-router";
import { logout } from "~/api/auth";
import { useAuth } from "~/context/AuthContext";

export function useLogout() {
  const navigate = useNavigate();
  const auth = useAuth();

  async function onLogout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await logout();
    } catch (error) {
      console.error("Erro ao revogar sessão:", error);
    } finally {
      localStorage.removeItem("jwt_token");
      auth.logout();

      navigate("/", { replace: true });
    }
  }

  return { onLogout };
}