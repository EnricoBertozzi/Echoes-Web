import { useState } from "react";
import { createUser } from "~/api/users";
import type { CreateUserRequest, UserRole } from "~/types/user";

export function useCreateUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleCreateUserSubmit({ name, email }: CreateUserRequest) {
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const res = await createUser("admin", { name, email });
      setSuccess(true);
    } catch (e) {
      setError("Erro ao cadastrar usuário, tente mais tarde.");
    } finally {
      setLoading(false);
    }
  }

  return {
    handleCreateUserSubmit,
    loading,
    error,
    success,
    setSuccess
  };
}
