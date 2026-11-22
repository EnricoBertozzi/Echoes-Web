import type { ReactNode } from "react";
import { Button } from "~/components/atoms/Button";
import { Modal } from "~/components/atoms/modal/Modal";
import { ModalText } from "~/components/atoms/modal/ModalText";
import { ModalTitle } from "~/components/atoms/modal/ModalTitle";

interface DeleteConfirmationModalProps {
  title: string;
  description: string;
  confirmLabel: string;
  isOpen?: boolean;
  confirmDisabled?: boolean;
  cancelDisabled?: boolean;
  children?: ReactNode;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmationModal({
  title,
  description,
  confirmLabel,
  isOpen = true,
  confirmDisabled = false,
  cancelDisabled = false,
  children,
  onClose,
  onConfirm,
}: DeleteConfirmationModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalTitle title={title} description={description} />

      <div className="flex flex-col gap-5">
        {children ?? <ModalText text="Essa ação não poderá ser desfeita" />}

        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            label="Cancelar"
            variant="muted"
            onClick={onClose}
            disabled={cancelDisabled}
          />
          <Button
            type="button"
            label={confirmLabel}
            variant="danger"
            onClick={onConfirm}
            disabled={confirmDisabled}
          />
        </div>
      </div>
    </Modal>
  );
}
