import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { validMfa, type MfaRequest } from "~/api/auth";

export function useValidMfa() {
  const navigate = useNavigate()

  async function handleMfaSubmit(data: MfaRequest) {

    const response = await validMfa(data);
    const status = response.status;

    if (status == 200) {
      // TODO alterar para cookie
      localStorage.setItem("jwt_token", response.data.token)
      navigate("/dashboard/scene")
    }
  }

  return {
    handleMfaSubmit
  };
}
