import { useNavigate } from "react-router";
import type { FormEvent } from "react";

export function useLogin() {
  const navigate = useNavigate();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate('/dashboard');
  }

  return {
    handleSubmit,
  }
}
