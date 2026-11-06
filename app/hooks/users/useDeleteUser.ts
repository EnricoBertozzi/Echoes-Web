import { useState } from "react";
import { deleteUser } from "~/api/users";
import { roleToUserRole } from "~/types/user";
import type { User } from "~/types/user";

export function useDeleteUser(user: User, onDeleted?: () => void) {
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function handleDelete() {
    setDeleteError(null);

    const confirmed = window.confirm(`Excluir o usuário ${user.name}?`);
    if (!confirmed) {
      return;
    }

    setDeleting(true);
    try {
      await deleteUser(roleToUserRole(user.role), user.id);
      onDeleted?.();
    } catch (error) {
      setDeleteError("Erro ao excluir usuário");
    } finally {
      setDeleting(false);
    }
  }

  return {
    deleting,
    deleteError,
    handleDelete,
  };
}
