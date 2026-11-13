import { useForm, type SubmitHandler } from "react-hook-form";

import type {
  ScenarioRegisterForm,
  ScenarioRegisterRequest,
} from "~/types/Scenario";

import { ModalForm } from "../atoms/modal/ModalForm";
import { ModalFormButtons } from "../molecules/ModalFormButtons";
import { Modal } from "../atoms/modal/Modal";
import { ModalTitle } from "../atoms/modal/ModalTitle";

import { ControlledTextField } from "../molecules/controlled/ControlledTextField";
import { ControlledFileField } from "../molecules/controlled/ControlledFileFIeld";
import { useCreateScenario } from "~/hooks/animals/useCreateScenario";
import { Alert } from "../atoms/page/Alert";
import { Button } from "../atoms/Button";

interface ScenarioAddModalProps {
  isOpen: boolean;
  pointId: string;
  onClose: () => void;
}

export function ScenarioAddModal({
  isOpen,
  pointId,
  onClose,
}: ScenarioAddModalProps) {
  const { control, handleSubmit } = useForm<ScenarioRegisterForm>({
    defaultValues: {
      name: "",
      description: "",
      file: null,
      pointId,
    },
  });

  const { handleScenarioAddSubmit, error, loading, success } =
    useCreateScenario();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {success ? (
        <>
          <ModalTitle
            title="Novo Cenário"
            description="Informe os dados do cenário"
          />
          <div className="flex flex-row justify-end">
            <div className="w-32">
              <Button label={"Fechar"} variant={"muted"} />
            </div>
          </div>
        </>
      ) : (
        <>
          <ModalTitle
            title="Novo Cenário"
            description="Informe os dados do cenário"
          />

          <ModalForm onSubmit={handleSubmit(handleScenarioAddSubmit)}>
            <ControlledTextField
              placeholder={"Digite o nome"}
              id="name"
              name="name"
              label="Nome"
              control={control}
              rules={{
                required: "O nome é obrigatório.",
              }}
            />
            <ControlledTextField
              id="description"
              name="description"
              label="Descrição"
              control={control}
              rules={{
                required: "A descrição é obrigatória.",
              }}
              placeholder={"Digite a descrição"}
            />
            <ControlledFileField
              id="scenario-file"
              name="file"
              label="Arquivo de áudio"
              control={control}
              accept="audio/*"
              rules={{
                required: "O arquivo de áudio é obrigatório.",
                validate: {
                  type: (file) =>
                    !file ||
                    file.type.startsWith("audio/") ||
                    "Selecione um arquivo de áudio.",
                },
              }}
            />
            {error && <Alert message={error} type={"error"} />}

            <div className="mt-3 flex gap-3 justify-end">
              <Button label={"Cancelar"} onClick={onClose} variant={"muted"} />
              <Button label={"Cadastrar"} variant="primary" />
            </div>
          </ModalForm>
        </>
      )}
    </Modal>
  );
}
