import { useState } from "react";
import type { FormEvent } from "react";
import { ApiRequestError, completeRegistration } from "~/api/users";
import type { User } from "~/types/user";

interface PasswordFormErrors {
  password?: string;
  confirmPassword?: string;
}

export function useRegister(code: string, urlEmail: string) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<PasswordFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [registeredUser, setRegisteredUser] = useState<User | null>(null);

  function validate(): boolean {
    const errors: PasswordFormErrors = {};

    if (password.length === 0) {
      errors.password = "A senha é obrigatória";
    } else if (password.length < 8) {
      errors.password = "A senha deve ter no mínimo 8 caracteres";
    }

    if (confirmPassword !== password) {
      errors.confirmPassword = "As senhas não coincidem";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting || registeredUser) {
      return;
    }

    setApiError(null);

    if (!validate()) {
      return;
    }

    setSubmitting(true);
    try {
      const user = await completeRegistration({ password, code, email: urlEmail });
      setRegisteredUser(user);
    } catch (error) {
      if (error instanceof ApiRequestError && error.fieldErrors) {
        const { password: passwordApiError, ...rest } = error.fieldErrors;

        if (passwordApiError) {
          setFieldErrors((previous) => ({
            ...previous,
            password: passwordApiError,
          }));
        }

        const unmapped = Object.values(rest);
        setApiError(unmapped.length > 0 ? unmapped.join(" · ") : null);
      } else if (error instanceof ApiRequestError) {
        setApiError(error.message);
      } else {
        setApiError("Erro ao finalizar o cadastro");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    fieldErrors,
    submitting,
    apiError,
    registeredUser,
    handleSubmit,
  };
}
