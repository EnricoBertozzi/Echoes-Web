import type { AuscultationPoint } from "~/types/AuscultationPoint";
import { ModalButton } from "../atoms/modal/ModalButton";
import { ModalText } from "../atoms/modal/ModalText";
import { ModalTitle } from "../atoms/modal/ModalTitle";
import { Modal } from "../atoms/modal/Modal";

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
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalTitle
        title={"Remover Ponto"}
        description={`Deseja remover o ponto ${point.position}?`}
      />

      <ModalText text="Essa ação não poderá ser desfeita" className="mt-8" />
      <div className="mt-12 flex gap-3 justify-end">
        <ModalButton
          label="Remover"
          onAction={onConfirm}
          className="bg-red-700"
          variant={"danger"}
        />
        <ModalButton
          label="Cancelar"
          onAction={onClose}
          className="bg-slate-"
          variant={"secondary"}
        />
      </div>
    </Modal>
  );
}
