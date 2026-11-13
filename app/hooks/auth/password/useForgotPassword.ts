import { useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { forgotPassword, type ForgotRequest } from "~/api/password";

export function useForgotPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleForgotPassword(data: ForgotRequest) {
    setLoading(true);
    setError("");

    try {
      const response = await forgotPassword(data);
      navigate(`/password/validate?email=${encodeURIComponent(data.email)}`);
    } catch (error) {
      setError("Código Inválido");
    } finally {
      setLoading(false);
    }
  }

  return {
    loading, 
    error,
    handleForgotPassword,
  };
}
