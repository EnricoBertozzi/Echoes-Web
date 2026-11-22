import { useForm } from "react-hook-form";
import type { Classroom, ClassroomRequest } from "~/types/Classroom";
import { Button } from "../atoms/Button";
import { Modal } from "../atoms/modal/Modal";
import { ModalForm } from "../atoms/modal/ModalForm";
import { ModalTitle } from "../atoms/modal/ModalTitle";
import { ControlledTextField } from "../molecules/controlled/ControlledTextField";

interface ClassroomFormModalProps {
  isOpen: boolean;
  classroom?: Classroom; // se vier, é edição
  onClose: () => void;
  onSubmit: (data: ClassroomRequest) => Promise<void>;
}

export function ClassroomFormModal({
  isOpen,
  classroom,
  onClose,
  onSubmit,
}: ClassroomFormModalProps) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ClassroomRequest>({
    defaultValues: {
      title: classroom?.title ?? "",
      description: classroom?.description ?? "",
      period: classroom?.period ?? "",
    },
  });

  async function submit(data: ClassroomRequest) {
    try {
      await onSubmit(data);
    } catch {
      // o interceptor do axios já mostrou o erro; o modal continua aberto
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalTitle
        title={classroom ? "Editar turma" : "Nova turma"}
        description="Informe os dados da turma"
      />

      <ModalForm onSubmit={handleSubmit(submit)}>
        <ControlledTextField
          id="title"
          name="title"
          label="Título"
          placeholder="Digite o título"
          control={control}
          rules={{
            required: "O título é obrigatório",
            maxLength: { value: 100, message: "Máximo de 100 caracteres" },
          }}
        />

        <ControlledTextField
          id="description"
          name="description"
          label="Descrição"
          placeholder="Digite a descrição (opcional)"
          control={control}
          rules={{
            maxLength: { value: 500, message: "Máximo de 500 caracteres" },
          }}
        />

        <ControlledTextField
          id="period"
          name="period"
          label="Período"
          placeholder="AAAA/SS, por exemplo 2026/01"
          control={control}
          rules={{
            required: "O período é obrigatório",
            pattern: {
              value: /^\d{4}\/0[12]$/,
              message: "Use o formato AAAA/SS, por exemplo 2026/01",
            },
          }}
        />

        <div className="mt-3 flex flex-col justify-end gap-3 sm:flex-row">
          <Button
            label="Cancelar"
            variant="muted"
            type="button"
            onClick={onClose}
          />
          <Button
            label={classroom ? "Salvar" : "Cadastrar"}
            variant="primary"
            type="submit"
            disabled={isSubmitting}
          />
        </div>
      </ModalForm>
    </Modal>
  );
}
