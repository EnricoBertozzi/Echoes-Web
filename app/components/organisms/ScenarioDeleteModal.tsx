import type { Scenario } from "~/types/Scenario";
import { ModalText } from "~/components/atoms/modal/ModalText";
import { DeleteConfirmationModal } from "./modal/DeleteConfirmationModal";

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
    <DeleteConfirmationModal
      isOpen={isOpen}
      title="Remover cenário"
      description={`Deseja remover o cenário ${scenario.name}?`}
      confirmLabel="Remover"
      onClose={onClose}
      onConfirm={onConfirm}
    >
      <ModalText text="Essa ação não poderá ser desfeita. Se o cenário estiver associado a algum dispositivo, a remoção será recusada: nesse caso, desative-o." />
    </DeleteConfirmationModal>
  );
}
