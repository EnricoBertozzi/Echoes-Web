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
  onReload: (id: string) => void;
}


// Os aparelhos só tocam MP3 (decodificador do firmware), então o cenário aceita só esse formato.
const MP3_MIME_TYPES = ["audio/mpeg", "audio/mp3"];

function isMp3(file: File): boolean {
  if (!file.name.toLowerCase().endsWith(".mp3")) return false;
  return file.type === "" || MP3_MIME_TYPES.includes(file.type);
}

export function ScenarioAddModal({
  isOpen,
  pointId,
  onClose,
  onReload,
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
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        onReload(pointId);
      }}
    >
      {success ? (
        <>
          <ModalTitle
            title="Cenário Cadastrado"
            description="Cenário cadastrado com sucesso"
          />
          <div className="flex flex-row justify-end">
            <div className="w-32">
              <Button
                label={"Fechar"}
                variant={"muted"}
                onClick={() => {
                  onClose();
                  onReload(pointId);
                }}
              />
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
              accept=".mp3,audio/mpeg"
              rules={{
                required: "O arquivo de áudio é obrigatório.",
                validate: {
                  type: (file) =>
                    !file ||
                    isMp3(file) ||
                    "Envie um arquivo de áudio no formato MP3.",
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
