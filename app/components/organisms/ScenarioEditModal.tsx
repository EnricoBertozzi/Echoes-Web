import { useState } from "react";

import type { Scenario, ScenarioUpdateRequest } from "~/types/Scenario";
import { ModalButton } from "../atoms/modal/ModalButton";
import { ModalForm } from "../atoms/modal/ModalForm";
import { ModalLongTextField } from "../atoms/modal/ModalLongTextField";
import { ModalTextField } from "../atoms/modal/ModalTextField";
import { ModalFormButtons } from "../molecules/ModalFormButtons";
import { Modal } from "../atoms/modal/Modal";
import { ModalTitle } from "../atoms/modal/ModalTitle";

interface ScenarioEditModalProps {
  isOpen: boolean;
  scenario: Scenario;
  onClose: () => void;
  onSubmit: (data: ScenarioUpdateRequest) => void;
}

export function ScenarioEditModal({
  isOpen,
  scenario,
  onClose,
  onSubmit,
}: ScenarioEditModalProps) {
  const [name, setName] = useState(scenario.name);

  const [description, setDescription] = useState(scenario.description);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onSubmit({
      name,
      description,
    });
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalTitle
        title={"Editar Cenário"}
        description={"Altere os dados do cenário"}
      />
      <ModalForm onSubmit={handleSubmit}>
        <ModalTextField
          id="scenario-name"
          label="Nome"
          value={name}
          onChange={setName}
          required
        />

        <ModalLongTextField
          id="scenario-description"
          label="Descrição"
          value={description}
          onChange={setDescription}
          required
        />

        <ModalFormButtons confirmLabel="Editar" onClose={onClose} />
      </ModalForm>
    </Modal>
  );
}
