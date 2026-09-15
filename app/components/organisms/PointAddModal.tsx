import { useState } from "react";

import type { Animal, AnimalDataRequest } from "~/types/Animal";
import { ModalLongTextField } from "../atoms/modal/ModalLongTextField";
import { ModalTextField } from "../atoms/modal/ModalTextField";
import { ModalTitle } from "../atoms/modal/ModalTitle";
import { ModalFormButtons } from "../molecules/ModalFormButtons";
import { Modal } from "../atoms/modal/Modal";
import { ModalForm } from "../atoms/modal/ModalForm";
import type { AuscultationPointRegisterRequest } from "~/types/AuscultationPoint";

interface PointAddModalProps {
  animal?: Animal;
  onClose: () => void;
  onSubmit: (data: AuscultationPointRegisterRequest) => void;
}

export function PointAddModal({ animal, onClose, onSubmit }: PointAddModalProps) {
  const [position, setPosition] = useState("");
  const animalId = `${animal?.id}`;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onSubmit({ position, animalId });
  }

  return (
    <Modal>
      <ModalTitle
        title={"Novo Ponto de Auscultal"}
        description="Informe os dados do ponto"
      />

      <ModalForm onSubmit={handleSubmit}>
        <ModalTextField
          id="animal-name"
          label="Nome"
          onChange={setPosition}
          value={position}
          required={true}
        />
        <ModalFormButtons confirmLabel={"Novo"} onClose={onClose} />
      </ModalForm>
    </Modal>
  );
}
