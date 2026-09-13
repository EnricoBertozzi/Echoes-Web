import type { AuscultationPoint } from "~/types/AuscultationPoint";
import { ModalButton } from "../atoms/modal/ModalButton";
import { ModalText } from "../atoms/modal/ModalText";
import { ModalTitle } from "../atoms/modal/ModalTitle";

interface PointDeleteModalProps {
  point: AuscultationPoint;
  onClose: () => void;
  onConfirm: () => void;
}

export function PointDeleteModal({point, onClose, onConfirm}: PointDeleteModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="w-125 rounded-2xl bg-white p-8">
        <ModalTitle
          title={"Remover Animal"}
          description={`Deseja remover o ponto ${point.position}?`}
        />

        <ModalText text="Essa ação não poderá ser desfeita" className="mt-8" />
        <div className="mt-12 flex gap-3 justify-end">
          <ModalButton
            label="Remover"
            onAction={onConfirm}
            className="bg-red-700"
          />
          <ModalButton
            label="Cancelar"
            onAction={onClose}
            className="bg-slate-"
          />
        </div>
      </div>
    </div>
  );
}
