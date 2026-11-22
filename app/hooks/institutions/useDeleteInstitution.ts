import { useState } from "react";
import { ApiRequestError } from "~/api/axios";
import { deleteInstitution } from "~/api/institutions";
import { useConfirmation } from "~/context/ConfirmationContext";
import type { Institution } from "~/types/Institution";

export function useDeleteInstitution(institution: Institution, onDeleted?: () => void) {
  const confirmAction = useConfirmation();
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function handleDelete() {
    setDeleteError(null);

    const confirmed = await confirmAction({
      title: "Excluir instituição",
      description: `Excluir a instituição ${institution.name}? Essa ação não pode ser desfeita.`,
      confirmLabel: "Excluir",
      variant: "danger",
    });
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
