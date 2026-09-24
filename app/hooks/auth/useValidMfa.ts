import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { validMfa } from "~/api/auth";

export function useValidMfa(email: string) {
  const [code, setCode] = useState("");
  const navigate = useNavigate()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const response = await validMfa({ email, code });
    const status = response.status;

    if (status == 200) {
      // TODO alterar para cookie
      localStorage.setItem("jwt_token", response.data.token)
      navigate("/dashboard/scene")
    }
  }

  return {
    code,
    setCode,
    handleSubmit,
  };
}
