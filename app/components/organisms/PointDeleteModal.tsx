import type { AuscultationPoint } from "~/types/AuscultationPoint";
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
    />
  );
}
