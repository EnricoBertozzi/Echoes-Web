import { useState } from "react";
import type { FormEvent } from "react";
import { updateUser } from "~/api/users";
import { roleToUserRole } from "~/types/user";
import type { User } from "~/types/user";

export function useUpdateUser(user: User, onUpdated?: () => void) {
  const [name, setName] = useState(user.name);
  const [submitting, setSubmitting] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  function reset() {
    setName(user.name);
    setSubmitting(false);
    setSucceeded(false);
    setFieldErrors({});
    setGeneralError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting || succeeded) {
      return;
    }

    setSubmitting(true);
    setFieldErrors({});
    setGeneralError(null);

    try {
      await updateUser(roleToUserRole(user.role), user.id, { name });
      setSucceeded(true);
      onUpdated?.();
    } catch (error) {
      setGeneralError("Erro ao editar usuário");
    } finally {
      setSubmitting(false);
    }
  }

  return {
    name,
    setName,
    submitting,
    succeeded,
    fieldErrors,
    generalError,
    reset,
    handleSubmit,
  };
}
