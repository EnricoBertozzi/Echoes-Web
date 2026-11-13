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
import { useForm } from "react-hook-form";
import { useEditPoint } from "~/hooks/animals/useEditPoint";
import { ControlledTextField } from "../molecules/controlled/ControlledTextField";
import { Button } from "../atoms/Button";
import { Alert } from "../atoms/page/Alert";

interface PointEditModalProps {
  isOpen: boolean;
  point: AuscultationPoint;
  onClose: () => void;
}

export function PointEditModal({
  isOpen,
  point,
  onClose,
}: PointEditModalProps) {
  const { control, handleSubmit, register } =
    useForm<AuscultationPointUpdateRequest>({
      defaultValues: {
        pointId: point.id,
        position: point.position,
      },
    });

  const { loading, error, success, handlePointEditSubmit } = useEditPoint();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {success ? (
        <>
          <ModalTitle
            title={"Pontos de Ausculta Alterado"}
            description="O ponto de ausculta foi alterado com sucesso"
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
            title={"Editar Ponto de Auscultal"}
            description="Informe os dados do ponto"
          />

          <ModalForm onSubmit={handleSubmit(handlePointEditSubmit)}>
            <input
              type="hidden"
              {...(register("pointId"), { value: point.id })}
            />

            <ControlledTextField
              id="position"
              name={"position"}
              label={"Posição"}
              control={control}
              placeholder={"Digite a posição do ponto"}
              rules={{
                required: "Posição é obrigatória",
              }}
            />

            {error && <Alert message={error} type={"error"} />}

            <div className="mt-3 flex gap-3 justify-end">
              <Button label="Cancelar" onClick={onClose} variant={"muted"} />
              <Button
                label={loading ? "Editando" : "Editar"}
                disabled={loading}
                variant="primary"
              />
            </div>
          </ModalForm>
        </>
      )}
    </Modal>
  );
}
