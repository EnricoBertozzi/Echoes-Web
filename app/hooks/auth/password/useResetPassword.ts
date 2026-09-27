import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { resetPassword, type ResetRequest } from "~/api/password";

type ResetPasswordStatus =
  | "idle"
  | "success"
  | "error";

export function useResetPassword() {
  const [status, setStatus] = useState<ResetPasswordStatus>("idle");

  async function handleResetPassword(data: ResetRequest) {

    if (data.token != null) {
      const response = await resetPassword(data);

      if (response.status == 204) {
        sessionStorage.removeItem("reset_token");
        setStatus("success")
      } else {
        setStatus("error")
      }
    } else {
      setStatus("error")
    } 
  }

  return {
    handleResetPassword,
    isSuccess: status === "success",
    isError: status === "error"
  };
}
