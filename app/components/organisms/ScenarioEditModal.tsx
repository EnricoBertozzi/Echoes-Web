import { useState } from "react";

import type { Scenario, ScenarioUpdateRequest } from "~/types/Scenario";
import { ModalButton } from "../atoms/modal/ModalButton";
import { ModalForm } from "../atoms/modal/ModalForm";
import { ModalLongTextField } from "../atoms/modal/ModalLongTextField";
import { ModalTextField } from "../atoms/modal/ModalTextField";
import { ModalFormButtons } from "../molecules/ModalFormButtons";

interface ScenarioEditModalProps {
  scenario: Scenario;
  onClose: () => void;
  onSubmit: (data: ScenarioUpdateRequest) => void;
}

export function ScenarioEditModal({
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-125 rounded-2xl bg-white p-8">
        <h2 className="mb-8 text-2xl font-bold text-slate-900">
          Editar Cenário
        </h2>

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
      </div>
    </div>
  );
}
