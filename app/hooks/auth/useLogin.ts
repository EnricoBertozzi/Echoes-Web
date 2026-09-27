import { useNavigate } from "react-router";
import { login, type LoginRequest } from "~/api/auth";

export function useLogin() {
  const navigate = useNavigate();

  async function handleLogin(data: LoginRequest) {
    const response = await login(data);
    if (response == 204) {
      navigate(`/mfa?email=${encodeURIComponent(data.email)}`);
    }
  }

  return {
    handleLogin,
  };
}
