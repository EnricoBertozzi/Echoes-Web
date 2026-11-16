import { useForm } from "react-hook-form";
import { Button } from "../atoms/Button";
import { Modal } from "../atoms/modal/Modal";
import { ModalForm } from "../atoms/modal/ModalForm";
import { ModalTitle } from "../atoms/modal/ModalTitle";
import { ControlledTextField } from "../molecules/controlled/ControlledTextField";

// mesmo alfabeto do backend: sem I, O, 0 e 1
const CODE_PATTERN = /^[A-HJ-NP-Z2-9]{6}$/i;

interface JoinFormData {
  code: string;
}

interface JoinClassroomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (code: string) => Promise<void>;
}

export function JoinClassroomModal({
  isOpen,
  onClose,
  onSubmit,
}: JoinClassroomModalProps) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<JoinFormData>({ defaultValues: { code: "" } });

  async function submit(data: JoinFormData) {
    try {
      await onSubmit(data.code.trim().toUpperCase());
    } catch {
      // o interceptor do axios já mostrou o erro; o modal continua aberto
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalTitle
        title="Entrar em turma"
        description="Digite o código de 6 caracteres que seu professor compartilhou"
      />

      <ModalForm onSubmit={handleSubmit(submit)}>
        <ControlledTextField
          id="code"
          name="code"
          label="Código da turma"
          placeholder="Por exemplo, K7M2QX"
          control={control}
          rules={{
            required: "Digite o código da turma",
            validate: (value) =>
              CODE_PATTERN.test(value.trim()) ||
              "O código tem 6 letras ou números, sem I, O, 0 e 1",
          }}
        />

        <div className="mt-3 flex justify-end gap-3">
          <Button
            label="Cancelar"
            variant="muted"
            type="button"
            onClick={onClose}
          />
          <Button
            label="Entrar na turma"
            variant="primary"
            type="submit"
            disabled={isSubmitting}
          />
        </div>
      </ModalForm>
    </Modal>
  );
}
