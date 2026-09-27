import { useState } from "react";
import type { FormEvent } from "react";
import { completeRegistration } from "~/api/users";
import type { CompleteRegistrationRequest, User } from "~/types/user";

interface PasswordFormErrors {
  password?: string;
  confirmPassword?: string;
}

export function useRegister(code: string, urlEmail: string) {
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [registeredUser, setRegisteredUser] = useState<User | null>(null);

  async function handleRegisterSubmit(data: CompleteRegistrationRequest) {

    if (submitting || registeredUser) {
      return;
    }

    setApiError(null);

    setSubmitting(true);
    try {
      const user = await completeRegistration(data);
      setRegisteredUser(user);
    } catch (error) {
      setApiError("Erro ao finalizar o cadastro");
    } finally {
      setSubmitting(false);
    }
  }

  return {
    submitting,
    apiError,
    registeredUser,
    handleRegisterSubmit,
  };
}
