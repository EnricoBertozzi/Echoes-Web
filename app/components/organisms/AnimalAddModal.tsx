import { useState } from "react";

import type { Animal, AnimalDataRequest } from "~/types/Animal";
import { ModalLongTextField } from "../atoms/modal/ModalLongTextField";
import { ModalTextField } from "../atoms/modal/ModalTextField";
import { ModalTitle } from "../atoms/modal/ModalTitle";
import { ModalFormButtons } from "../molecules/ModalFormButtons";
import { Modal } from "../atoms/modal/Modal";
import { ModalForm } from "../atoms/modal/ModalForm";

interface AnimalAddModalProps {
  onClose: () => void;
  onSubmit: (data: AnimalDataRequest) => void;
}

export function AnimalAddModal({ onClose, onSubmit }: AnimalAddModalProps) {
  const [name, setName] = useState("");
  const [model, setModel] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onSubmit({ name, description, model });
  }

  return (
    <Modal>
      <ModalTitle title={"Novo Animal"} description="Informe os dados do novo animal" />

      <ModalForm onSubmit={handleSubmit} >
        <ModalTextField id="animal-name" label="Nome" onChange={setName} value={name} required={true}/>          
        <ModalTextField id="animal-model" label="Modelo" onChange={setModel} value={model} required={true}/>
        <ModalLongTextField id="animal-description" label="Descrição" onChange={setDescription} value={description} required={true}/>
        <ModalFormButtons confirmLabel={"Novo"} onClose={onClose} />
      </ModalForm>
      
    </Modal>
  );
}