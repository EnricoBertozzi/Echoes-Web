import { useState } from "react";
import type { FormEvent } from "react";
import { completeRegistration } from "~/api/users";
import type { CompleteRegistrationRequest, User } from "~/types/user";
import { requiredTermTypes } from "~/types/terms";

export function useRegister(code: string, urlEmail: string) {
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [registeredUser, setRegisteredUser] = useState<User | null>(null);

  const [acceptedTerms, setAcceptedTerms] = useState(false);

  async function handleRegisterSubmit(data: Omit<CompleteRegistrationRequest, "acceptedTerms">) {

    if (submitting || registeredUser) {
      return;
    }

    if (!acceptedTerms) {
      setApiError("Você precisa aceitar os termos para concluir o cadastro.");
      return;
    }

    setApiError(null);

    setSubmitting(true);
    try {
      const user = await completeRegistration({
        ...data,
        acceptedTerms: requiredTermTypes,
      });
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
    acceptedTerms,
    setAcceptedTerms,
    handleRegisterSubmit,
  };
}
