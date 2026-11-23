import type { AuscultationPoint } from "~/types/AuscultationPoint";
import { ModalText } from "~/components/atoms/modal/ModalText";
import { DeleteConfirmationModal } from "./modal/DeleteConfirmationModal";

interface PointDeleteModalProps {
  isOpen: boolean;
  point: AuscultationPoint;
  onClose: () => void;
  onConfirm: () => void;
}

export function PointDeleteModal({
  isOpen,
  point,
  onClose,
  onConfirm,
}: PointDeleteModalProps) {
  return (
    <DeleteConfirmationModal
      isOpen={isOpen}
      title="Remover ponto"
      description={`Deseja remover o ponto ${point.position}?`}
      confirmLabel="Remover"
      onClose={onClose}
      onConfirm={onConfirm}
    >
      <ModalText text="Essa ação não poderá ser desfeita. Se o ponto estiver associado a algum dispositivo, a remoção será recusada: nesse caso, desative-o." />
    </DeleteConfirmationModal>
  );
}
