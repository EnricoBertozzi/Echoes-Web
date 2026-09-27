import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { validatePasswordCode, type ValidateCodeRequest } from "~/api/password";

export function useValidatePasswordCode() {
  const [code, setCode] = useState("");
  const navigation = useNavigate();

  async function handleValidatePasswordCode(data: ValidateCodeRequest) {

    const response = await validatePasswordCode(data);
    if (response.status == 200) {
      sessionStorage.setItem("reset_token", response.data.token);
      navigation(`/password/reset?email=${data.email}`);
    }
  }

  return {
    code,
    setCode,
    handleValidatePasswordCode,
  };
}
