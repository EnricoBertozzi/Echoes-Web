import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { validatePasswordCode } from "~/api/password";

export function useValidatePasswordCode(email: string) {
  const [code, setCode] = useState("");
  const navigation = useNavigate();

  async function handleValidatePasswordCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const response = await validatePasswordCode({ email, code });
    if (response.status == 200) {
      sessionStorage.setItem("reset_token", response.data.token);
      navigation(`/password/reset?email=${email}`);
    }
  }

  return {
    code,
    setCode,
    handleValidatePasswordCode,
  };
}
