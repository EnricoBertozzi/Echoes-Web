import { useState } from "react";

import type { Animal, AnimalDataRequest } from "~/types/Animal";
import { ModalLongTextField } from "../atoms/modal/ModalLongTextField";
import { ModalTextField } from "../atoms/modal/ModalTextField";
import { ModalTitle } from "../atoms/modal/ModalTitle";
import { ModalFormButtons } from "../molecules/ModalFormButtons";
import { Modal } from "../atoms/modal/Modal";
import { ModalForm } from "../atoms/modal/ModalForm";

interface AnimalEditModalProps {
  animal?: Animal;
  onClose: () => void;
  onSubmit: (data: AnimalDataRequest) => void;
}

export function AnimalEditModal({ animal, onClose, onSubmit }: AnimalEditModalProps) {
  const [name, setName] = useState(animal?.name ?? "");
  const [model, setModel] = useState(animal?.model ?? "");
  const [description, setDescription] = useState(animal?.description ?? "");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onSubmit({ name, description, model });
  }

  return (
    <Modal>
      <ModalTitle title={"Editar Animal"} description="Informe os dados do novo animal" />

      <ModalForm onSubmit={handleSubmit} >
        <ModalTextField id="animal-name" label="Nome" onChange={setName} value={name} required={true}/>          
        <ModalTextField id="animal-model" label="Modelo" onChange={setModel} value={model} required={true}/>
        <ModalLongTextField id="animal-description" label="Descrição" onChange={setDescription} value={description} required={true}/>
        <ModalFormButtons confirmLabel={"Editar"} onClose={onClose} />
      </ModalForm>
      
    </Modal>
  );
}
