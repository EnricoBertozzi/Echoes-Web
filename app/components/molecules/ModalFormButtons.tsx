import { ModalButton } from "../atoms/modal/ModalButton";

export interface ModalFormButtonsProps {
  confirmLabel: string;
  onClose: () => void;
}

export function ModalFormButtons({
  confirmLabel,
  onClose,
}: ModalFormButtonsProps) {
  return (
    <div className="mt-3 flex gap-3 justify-end">
      <button
        type="button"
        className="cursor-pointer bg-stone-300 rounded-lg px-6 py-3"
        onClick={onClose}
      >
        <p className="text-slate-900 text-xl line-clamp-3 wrap-break-word">
          Cancelar
        </p>
      </button>

      <button
        type="submit"
        className="cursor-pointer bg-[#3730A3] rounded-lg px-6 py-3 ${className}"
      >
        <p className=" text-white text-xl line-clamp-3 wrap-break-word">
          {confirmLabel}
        </p>
      </button>
    </div>
  );
}
