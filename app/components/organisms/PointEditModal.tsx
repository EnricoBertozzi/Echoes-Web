import { useState } from "react";

import type { Animal, AnimalDataRequest } from "~/types/Animal";
import { ModalLongTextField } from "../atoms/modal/ModalLongTextField";
import { ModalTextField } from "../atoms/modal/ModalTextField";
import { ModalTitle } from "../atoms/modal/ModalTitle";
import { ModalFormButtons } from "../molecules/ModalFormButtons";
import { Modal } from "../atoms/modal/Modal";
import { ModalForm } from "../atoms/modal/ModalForm";
import type {
  AuscultationPoint,
  AuscultationPointRegisterRequest,
  AuscultationPointUpdateRequest,
} from "~/types/AuscultationPoint";

interface PointEditModalProps {
  point: AuscultationPoint;
  onClose: () => void;
  onSubmit: (data: AuscultationPointUpdateRequest) => void;
}

export function PointEditModal({
  point,
  onClose,
  onSubmit,
}: PointEditModalProps) {
  const [position, setPosition] = useState(point.position);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onSubmit({ position });
  }

  return (
    <Modal>
      <ModalTitle
        title={"Editar Ponto de Auscultal"}
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
