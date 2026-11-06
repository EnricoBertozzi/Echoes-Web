import type { FormEvent } from "react";
import { useNavigate } from "react-router";
import { logout as revokeSession } from "~/api/auth";
import { useAuth } from "~/context/AuthContext";

export function useLogout() {
  const { logout } = useAuth();

  async function onLogout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await revokeSession();
    } catch (error) {
      console.error("Erro ao revogar sessão:", error);
    } finally {
      logout();
    }
  }

  return { onLogout };
}
