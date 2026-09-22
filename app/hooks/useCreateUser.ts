import { useState } from "react";
import type { FormEvent } from "react";
import { createUser } from "~/api/users";
import type { UserRole } from "~/types/user";

export function useCreateUser(onCreated?: () => void) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("admin");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  function reset() {
    setName("");
    setEmail("");
    setRole("admin");
    setSubmitting(false);
    setSuccess(false);
    setFieldErrors({});
    setGeneralError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting || success) {
      return;
    }

    setSubmitting(true);
    setFieldErrors({});
    setGeneralError(null);

    try {
      await createUser(role, { name, email });
      setSuccess(true);
      onCreated?.();
    } catch (error) {
      setGeneralError("Erro ao cadastrar usuário");
    } finally {
      setSubmitting(false);
    }
  }

  return {
    name,
    setName,
    email,
    setEmail,
    role,
    setRole,
    submitting,
    success,
    fieldErrors,
    generalError,
    reset,
    handleSubmit,
  };
}
