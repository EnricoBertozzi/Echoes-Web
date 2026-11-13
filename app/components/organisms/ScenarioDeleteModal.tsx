import type { Scenario } from "~/types/Scenario";

import { ModalButton } from "../atoms/modal/ModalButton";
import { ModalText } from "../atoms/modal/ModalText";
import { ModalTitle } from "../atoms/modal/ModalTitle";
import { Modal } from "../atoms/modal/Modal";

interface ScenarioDeleteModalProps {
  isOpen: boolean;
  scenario: Scenario;
  onClose: () => void;
  onConfirm: () => void;
}

export function ScenarioDeleteModal({
  scenario,
  isOpen,
  onClose,
  onConfirm,
}: ScenarioDeleteModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalTitle
        title="Remover Cenário"
        description={`Deseja remover o cenário ${scenario.name}?`}
      />

      <ModalText text="Essa ação não poderá ser desfeita" className="mt-8" />

      <div className="mt-12 flex justify-end gap-3">
        <ModalButton
          variant="danger"
          label="Remover"
          onAction={onConfirm}
          className="bg-red-700"
        />

        <ModalButton
          variant="secondary"
          label="Cancelar"
          onAction={onClose}
          className="bg-slate-200"
        />
      </div>
      
    </Modal>
  );
}
