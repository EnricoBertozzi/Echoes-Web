import type { Animal } from "~/types/Animal";
import { ModalText } from "~/components/atoms/modal/ModalText";
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
    >
      <ModalText text="Essa ação não poderá ser desfeita. Se o animal estiver associado a algum dispositivo, a remoção será recusada: nesse caso, desative-o." />
    </DeleteConfirmationModal>
  );
}
