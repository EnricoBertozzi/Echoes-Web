import { useNavigate } from "react-router";
import { useState, type FormEvent } from "react";
import { login } from "~/api/auth";

export function useLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const response = await login({ email, password });
    if (response == 204) {
      navigate(`/mfa?email=${encodeURIComponent(email)}`);
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    handleSubmit,
  };
}
