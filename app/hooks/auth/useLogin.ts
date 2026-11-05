import { useState } from "react";
import { useNavigate } from "react-router";
import { login, type LoginRequest } from "~/api/auth";

export function useLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(data: LoginRequest) {
    setLoading(true);

    try {
      const response = await login(data);
      navigate(`/mfa?email=${encodeURIComponent(data.email)}`);
    } catch {
      setError("Credenciais Inválidas");
    } finally {
      setLoading(false)
    }
  }

  return {
    handleLogin,
    loading,
    error
  };
}
