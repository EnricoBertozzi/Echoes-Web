import { useState } from "react";

import type { ScenarioRegisterRequest } from "~/types/Scenario";
import { ModalForm } from "../atoms/modal/ModalForm";
import { ModalButton } from "../atoms/modal/ModalButton";
import { ModalLongTextField } from "../atoms/modal/ModalLongTextField";
import { ModalTextField } from "../atoms/modal/ModalTextField";
import { ModalFormButtons } from "../molecules/ModalFormButtons";
import { Modal } from "../atoms/modal/Modal";
import { ModalTitle } from "../atoms/modal/ModalTitle";
import { ModalFileField } from "../atoms/modal/ModalFileField";

interface ScenarioAddModalProps {
  pointId: string;
  onClose: () => void;
  onSubmit: (data: ScenarioRegisterRequest, file: File) => void;
}

export function ScenarioAddModal({
  pointId,
  onClose,
  onSubmit,
}: ScenarioAddModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file) {
      return;
    }

    onSubmit({ name, description, pointId, }, file);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Modal>
        <ModalTitle
          title="Novo Cenário"
          description="Informe os dados do cenário"
        />
        <ModalForm onSubmit={handleSubmit}>
          <ModalTextField id="scenario-name" label="Nome" value={name} onChange={setName} required/>
          <ModalLongTextField id="scenario-description" label="Descrição" value={description} onChange={setDescription} required/>
          <ModalFileField id="scenario-file" label="Arquivo de áudio" onChange={setFile} accept="audio/*" required/>
          
          <ModalFormButtons confirmLabel="Cadastrar" onClose={onClose} />
        </ModalForm>
      </Modal>
    </div>
  );
}
