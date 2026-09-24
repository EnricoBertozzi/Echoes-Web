import { useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { forgotPassword } from "~/api/password";

export function useForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  async function handleForgotPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    
    const response = await forgotPassword({ email });

    if (response.status == 204) {
      navigate(`/password/validate?email=${encodeURIComponent(email)}`);
    }
  }

  return {
    email,
    setEmail,
    handleForgotPassword,
  };
}
