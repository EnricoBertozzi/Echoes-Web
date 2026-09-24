import type { FormEvent } from "react";
import { useNavigate } from "react-router";
import { logout } from "~/api/auth";

export function useLogout() {
  const navigation = useNavigate();

  async function onLogout() {

    const response = await logout();
    if (response.status == 204) {
      localStorage.removeItem("jwt_token");
      navigation("/");
    }
  }

  return {
    onLogout,
  };
}
