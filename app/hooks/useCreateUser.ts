import { useState } from "react";
import type { FormEvent } from "react";
import { createUser } from "~/api/users";
import type { CreateUserRequest, UserRole } from "~/types/user";

export function useCreateUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCreateUserSubmit({name, email}: CreateUserRequest) {

    setLoading(true)
    setError("")
    try {
      const res = await createUser("admin", {name, email});
    } catch (e) {
      setError("Erro ao cadastrar usuário, tente mais tarde.");
    } finally {
      setLoading(false)
    }
  }

  return {
    handleCreateUserSubmit,
    loading,
    error
  };
}
