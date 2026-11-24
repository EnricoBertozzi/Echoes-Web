import { useState } from "react";
import { createUser } from "~/api/users";
import type {
  CreateInstitutionalUserRequest,
  CreateUserRequest,
  UserRole,
} from "~/types/user";

export function useCreateUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleCreateAdminUserSubmit({
    name,
    surname,
    email,
  }: CreateUserRequest) {
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const res = await createUser("admin", {
        name: name.trim(),
        surname: surname.trim(),
        email: email.trim(),
      });
      setSuccess(true);
    } catch (e) {
      setError("Erro ao cadastrar usuário, tente mais tarde.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateInstitutionalUserSubmit({
    name,
    surname,
    email,
    institutionId,
    role,
  }: CreateInstitutionalUserRequest) {
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const res = await createUser(role, {
        name: name.trim(),
        surname: surname.trim(),
        email: email.trim(),
        institutionId,
      });
      setSuccess(true);
    } catch (e) {
      setError("Erro ao cadastrar usuário, tente mais tarde.");
    } finally {
      setLoading(false);
    }
  }

  return {
    handleCreateAdminUserSubmit,
    handleCreateInstitutionalUserSubmit,
    loading,
    error,
    success,
    setSuccess,
  };
}
