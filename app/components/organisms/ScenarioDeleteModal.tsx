import type { Scenario } from "~/types/Scenario";
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
    />
  );
}
