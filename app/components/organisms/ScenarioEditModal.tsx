import { useState } from "react";

import type { Scenario, ScenarioUpdateRequest } from "~/types/Scenario";
import { ModalButton } from "../atoms/modal/ModalButton";
import { ModalForm } from "../atoms/modal/ModalForm";
import { ModalLongTextField } from "../atoms/modal/ModalLongTextField";
import { ModalTextField } from "../atoms/modal/ModalTextField";
import { ModalFormButtons } from "../molecules/ModalFormButtons";
import { Modal } from "../atoms/modal/Modal";
import { ModalTitle } from "../atoms/modal/ModalTitle";
import { ControlledTextField } from "../molecules/controlled/ControlledTextField";
import { useForm } from "react-hook-form";
import { Button } from "../atoms/Button";
import { useEditScenario } from "~/hooks/animals/useEditScenario";
import { Alert } from "../atoms/page/Alert";

interface ScenarioEditModalProps {
  isOpen: boolean;
  scenario: Scenario;
  onClose: () => void;
  onReload: () => void;
}

export function ScenarioEditModal({
  isOpen,
  scenario,
  onClose,
  onReload,
}: ScenarioEditModalProps) {
  const { control, handleSubmit, register } = useForm<ScenarioUpdateRequest>({
    defaultValues: {
      id: scenario.id,
      name: scenario.name,
      description: scenario.description,
    },
  });

  const { loading, error, success, handleEditScenarioSubmit } =
    useEditScenario();

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        onReload();
      }}
    >
      {success ? (
        <>
          <ModalTitle
            title={"Cenário Alterado"}
            description={"Cenário alterado com sucesso"}
          />
          <div className="flex flex-row justify-end">
            <div className="w-32">
              <Button
                label={"Fechar"}
                variant={"muted"}
                onClick={() => {
                  onClose();
                  onReload();
                }}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <ModalTitle
            title={"Editar Cenário"}
            description={"Altere os dados do cenário"}
          />
          <ModalForm onSubmit={handleSubmit(handleEditScenarioSubmit)}>
            <ControlledTextField
              id="name"
              name="name"
              label="Nome"
              placeholder="Digite o nome do cenário"
              control={control}
              rules={{
                required: "Nome é obrigatório",
              }}
            />
            <ControlledTextField
              control={control}
              id="description"
              name="description"
              label="Descrição"
              placeholder="Digite a descrição"
              rules={{
                required: "Descrição obrigatória",
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
