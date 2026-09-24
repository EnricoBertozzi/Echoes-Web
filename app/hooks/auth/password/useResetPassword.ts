import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { resetPassword } from "~/api/password";

export function useResetPassword(email: string) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigation = useNavigate();

  async function handleResetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const token = sessionStorage.getItem("reset_token");
    if (newPassword === confirmPassword && token != null) {
      const response = await resetPassword({ email, token, newPassword });

      if (response.status == 204) {
        sessionStorage.removeItem("reset_token");
        navigation("/");
      }
    } else {
      toast.warning("As senhas são diferentes");
    }
  }

  return {
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    handleResetPassword,
  };
}
