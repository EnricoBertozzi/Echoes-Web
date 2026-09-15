import { useState } from "react";
import { ApiRequestError, deleteInstitution } from "~/api/institutions";
import type { Institution } from "~/types/Institution";

export function useDeleteInstitution(institution: Institution, onDeleted?: () => void) {
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function handleDelete() {
    setDeleteError(null);

    const confirmed = window.confirm(
      `Excluir a instituição ${institution.name}? Essa ação não pode ser desfeita.`,
    );
    if (!confirmed) {
      return;
    }

    setDeleting(true);
    try {
      await deleteInstitution(institution.id);
      onDeleted?.();
    } catch (error) {
      if (error instanceof ApiRequestError) {
        setDeleteError(error.message);
      } else {
        setDeleteError("Erro ao excluir instituição");
      }
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
