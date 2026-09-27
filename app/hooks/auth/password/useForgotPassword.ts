import { useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { forgotPassword, type ForgotRequest } from "~/api/password";

export function useForgotPassword() {
  const navigate = useNavigate();

  async function handleForgotPassword(data: ForgotRequest) {
    
    const response = await forgotPassword(data);

    if (response.status == 204) {
      navigate(`/password/validate?email=${encodeURIComponent(data.email)}`);
    }
  }

  return {
    handleForgotPassword,
  };
}
