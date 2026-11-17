import { useState } from "react";

import type {
  Animal,
  AnimalDataRequest,
  AnimalUpdateRequest,
} from "~/types/Animal";
import { ModalLongTextField } from "../atoms/modal/ModalLongTextField";
import { ModalTextField } from "../atoms/modal/ModalTextField";
import { ModalTitle } from "../atoms/modal/ModalTitle";
import { ModalFormButtons } from "../molecules/ModalFormButtons";
import { Modal } from "../atoms/modal/Modal";
import { ModalForm } from "../atoms/modal/ModalForm";
import { useForm } from "react-hook-form";
import { ControlledTextField } from "../molecules/controlled/ControlledTextField";
import { Button } from "../atoms/Button";
import { useEditAnimal } from "~/hooks/animals/useEditAnimal";
import { Alert } from "../atoms/page/Alert";

interface AnimalEditModalProps {
  animal?: Animal;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AnimalEditModal({
  animal,
  onClose,
  isOpen,
  onSuccess,
}: AnimalEditModalProps) {
  const { control, handleSubmit, register } = useForm<AnimalUpdateRequest>({
    defaultValues: {
      id: animal?.id,
      name: animal?.name,
      model: animal?.model,
      description: animal?.description,
    },
  });

  const { loading, error, success, handleEditScenarioSubmit } = useEditAnimal();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {success ? (
        <>
          <ModalTitle
            title={"Animal Alterado"}
            description="Os dados do modelo foram alterados com sucesso"
          />
          <div className="flex flex-row justify-end">
            <div className="w-32">
              <Button
                label={"Fechar"}
                onClick={() => {
                  onClose();
                  onSuccess();
                }}
                variant={"muted"}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <ModalTitle
            title={"Editar Animal"}
            description="Informe os dados do novo animal"
          />

          <ModalForm onSubmit={handleSubmit(handleEditScenarioSubmit)}>
            <input type="hidden" {...register("id", { value: animal?.id })} />
            <ControlledTextField
              control={control}
              id="name"
              name="name"
              label="Nome"
              placeholder={"Digite um nome"}
              rules={{
                required: "Nome é obrigatório",
              }}
            />

            <ControlledTextField
              control={control}
              id="model"
              name="model"
              label="Modelo"
              placeholder={"Digite o modelo"}
              rules={{
                required: "Modelo é obrigatorio",
              }}
            />
            <ControlledTextField
              control={control}
              id={"description"}
              name={"description"}
              label={"Descrição"}
              placeholder={"Digite a descrição"}
              rules={{
                required: "Descrição é obrigatória",
              }}
            />

            {error && <Alert message={error} type={"error"} />}

            <div className="mt-3 flex gap-3 justify-end">
              <Button label="Cancelar" onClick={onClose} variant={"muted"} />
              <Button label="Editar" variant="primary" disabled={loading} />
            </div>
          </ModalForm>
        </>
      )}
    </Modal>
  );
}
