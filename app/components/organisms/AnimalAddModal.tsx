import { useState } from "react";

import type { Animal, AnimalDataRequest } from "~/types/Animal";
import { ModalLongTextField } from "../atoms/modal/ModalLongTextField";
import { ModalTextField } from "../atoms/modal/ModalTextField";
import { ModalTitle } from "../atoms/modal/ModalTitle";
import { ModalFormButtons } from "../molecules/ModalFormButtons";
import { Modal } from "../atoms/modal/Modal";
import { ModalForm } from "../atoms/modal/ModalForm";
import { useForm } from "react-hook-form";
import { ControlledTextField } from "../molecules/controlled/ControlledTextField";
import { Button } from "../atoms/Button";
import { useCreateAnimal } from "~/hooks/animals/useCreateAnimal";
import { Alert } from "../atoms/page/Alert";

interface AnimalAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AnimalAddModal({ isOpen, onClose, onSuccess }: AnimalAddModalProps) {
  const { handleSubmit, control } = useForm<AnimalDataRequest>({
    defaultValues: {
      name: "",
      description: "",
      model: "",
    },
  });

  const { loading, error, success, handleCreateAnimalSubmit } =
    useCreateAnimal();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {success ? (
        <>
          <ModalTitle
            title={"Animal Cadastrado"}
            description={"Animal cadastrado com sucesso"}
          />

          <div className="flex flex-row justify-end">
            <div className="w-32">
              <Button label={"Fechar"} variant={"muted"} onClick={() => {
                onSuccess()
                onClose()
              }} />
            </div>
          </div>
        </>
      ) : (
        <>
          <ModalTitle
            title={"Novo Animal"}
            description="Informe os dados do novo animal"
          />

          <ModalForm onSubmit={handleSubmit(handleCreateAnimalSubmit)}>
            <ControlledTextField
              id="name"
              name="name"
              label="Nome"
              placeholder="Digite o nome"
              control={control}
              rules={{
                required: "Nome é obrigatório",
              }}
            />
            <ControlledTextField
              id="modelo"
              name="model"
              label="Modelo"
              placeholder="Digite o modelo"
              control={control}
              rules={{
                required: "Modelo é obrigatório",
              }}
            />
            <ControlledTextField
              id="description"
              name="description"
              label="Descrição"
              placeholder="Digite a descrição"
              control={control}
              rules={{
                required: "Descrição é obrigatório",
              }}
            />

            {error && <Alert message={error} type={"error"} />}

            <div className="mt-3 flex gap-3 justify-end">
              <Button label="Cancelar" onClick={onClose} variant={"muted"} />
              <Button label="Cadastrar" variant="primary" disabled={loading} />
            </div>
          </ModalForm>
        </>
      )}
    </Modal>
  );
}
