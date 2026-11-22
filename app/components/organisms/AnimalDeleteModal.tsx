import type { Animal } from "~/types/Animal";
import { DeleteConfirmationModal } from "./modal/DeleteConfirmationModal";

interface AnimalDeleteModalProps {
  animal: Animal;
  onClose: () => void;
  onConfirm: () => void;
}

export function AnimalDeleteModal({
  animal,
  onClose,
  onConfirm,
}: AnimalDeleteModalProps) {
  return (
    <DeleteConfirmationModal
      title="Remover animal"
      description={`Deseja remover o animal ${animal.name}?`}
      confirmLabel="Remover"
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
}
