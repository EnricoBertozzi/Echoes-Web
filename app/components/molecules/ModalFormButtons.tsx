import { ModalButton } from "../atoms/modal/ModalButton";

export interface ModalFormButtonsProps {
  confirmLabel: string,
  onClose: () => void
}

export function ModalFormButtons({confirmLabel, onClose}: ModalFormButtonsProps) {
  return (
    <div className="mt-3 flex gap-3 justify-end">
      <ModalButton label="Cancelar" onAction={onClose} className="bg-stone-300" />
      <ModalButton type="submit" label={confirmLabel} className="bg-[#3730A3]" />
    </div>
  );
}
