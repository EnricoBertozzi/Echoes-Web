import { Button } from "../atoms/Button";
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
      <Button label={"Cancelar"} onClick={onClose} variant={"muted"} />
      <Button label={confirmLabel} variant="primary" />
    </div>
  );
}
