import type { Scenario } from "~/types/Scenario";

import { ModalButton } from "../atoms/modal/ModalButton";
import { ModalText } from "../atoms/modal/ModalText";
import { ModalTitle } from "../atoms/modal/ModalTitle";

interface ScenarioDeleteModalProps {
  scenario: Scenario;
  onClose: () => void;
  onConfirm: () => void;
}

export function ScenarioDeleteModal({
  scenario,
  onClose,
  onConfirm,
}: ScenarioDeleteModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="w-125 rounded-2xl bg-white p-8">
        <ModalTitle
          title="Remover Cenário"
          description={`Deseja remover o cenário ${scenario.name}?`}
        />

        <ModalText
          text="Essa ação não poderá ser desfeita"
          className="mt-8"
        />

        <div className="mt-12 flex justify-end gap-3">
          <ModalButton
            label="Remover"
            onAction={onConfirm}
            className="bg-red-700"
          />

          <ModalButton
            label="Cancelar"
            onAction={onClose}
            className="bg-slate-200"
          />
        </div>
      </div>
    </div>
  );
}