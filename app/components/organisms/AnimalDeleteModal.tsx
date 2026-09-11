import type { Animal } from "~/types/Animal";
import { ModalTitle } from "../atoms/modal/ModalTitle";
import { ModalButton } from "../atoms/modal/ModalButton";
import { ModalText } from "../atoms/modal/ModalText";

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
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="w-125 rounded-2xl bg-white p-8">
       
        <ModalTitle title={"Remover Animal"} description={`Deseja remover o animal ${animal.name}?`} />

        <ModalText text="Essa ação não poderá ser desfeita" className="mt-8"/>
        <div className="mt-12 flex gap-3 justify-end">
          <ModalButton label="Remover" onAction={onConfirm} className="bg-red-700"/>
          <ModalButton label="Cancelar" onAction={onClose} className="bg-slate-"/>
        </div>
      </div>
    </div>
  );
}
