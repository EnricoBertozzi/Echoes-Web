import { useState } from "react";

import type { Animal, AnimalDataRequest } from "~/types/Animal";
import { ModalLongTextField } from "../atoms/modal/ModalLongTextField";
import { ModalTextField } from "../atoms/modal/ModalTextField";
import { ModalTitle } from "../atoms/modal/ModalTitle";
import { ModalFormButtons } from "../molecules/ModalFormButtons";
import { Modal } from "../atoms/modal/Modal";
import { ModalForm } from "../atoms/modal/ModalForm";
import type { AuscultationPointRegisterRequest } from "~/types/AuscultationPoint";
import { useForm } from "react-hook-form";
import { useCreatePoint } from "~/hooks/animals/useCreatePoint";
import { ControlledTextField } from "../molecules/controlled/ControlledTextField";
import { Button } from "../atoms/Button";
import { Alert } from "../atoms/page/Alert";

interface PointAddModalProps {
  isOpen: boolean;
  animal?: Animal;
  onClose: () => void;
}

export function PointAddModal({ animal, isOpen, onClose }: PointAddModalProps) {
  if (!animal?.id) {
    onClose();
  }

  const { control, handleSubmit, register } =
    useForm<AuscultationPointRegisterRequest>({
      defaultValues: {
        animalId: animal?.id,
        position: "",
      },
    });
  const { handlePointAddSubmit, loading, error, success } = useCreatePoint();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {success ? (
        <>
          <ModalTitle
            title={"Ponto Cadastrado"}
            description="O ponto foi cadastrado com sucesso"
          />

          <div className="flex justify-end">
            <div className="w-36">
              <Button label={"Fechar"} variant={"muted"} onClick={onClose} />
            </div>
          </div>
        </>
      ) : (
        <>
          <ModalTitle
            title={"Novo Ponto de Auscultal"}
            description="Informe os dados do ponto"
          />

          <ModalForm onSubmit={handleSubmit(handlePointAddSubmit)}>
            <input
              type="hidden"
              {...(register("animalId"), { value: animal?.id })}
            />
            <ControlledTextField
              control={control}
              id={"ponto"}
              name={"position"}
              label={"Posição"}
              placeholder={"Digite a posição do ponto"}
              rules={{
                required: "Posição é obrigatória",
              }}
            />

            {error && <Alert message={error} type={"error"} />}

            <div className="mt-3 flex gap-3 justify-end">
              <Button label={"Cancelar"} variant={"muted"} onClick={onClose} />
              <Button
                label={"Cadastrar"}
                disabled={loading}
                variant={"primary"}
                type="submit"
              />
            </div>
          </ModalForm>
        </>
      )}
    </Modal>
  );
}
