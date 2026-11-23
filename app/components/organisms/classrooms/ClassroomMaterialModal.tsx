import { useEffect } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { Button } from "~/components/atoms/Button";
import { Modal } from "~/components/atoms/modal/Modal";
import { ModalTitle } from "~/components/atoms/modal/ModalTitle";
import { ControlledFileField } from "~/components/molecules/controlled/ControlledFileFIeld";
import { ControlledTextField } from "~/components/molecules/controlled/ControlledTextField";
import type { ClassroomMaterial } from "~/types/ClassroomMaterial";
import { validateUploadSize, WEB_UPLOAD_LIMIT_MB } from "~/utils/uploadValidation";

type Mode = "create" | "edit" | "replace";
type Values = { title: string; description: string; file: File | null };

export interface ClassroomMaterialModalProps {
  isOpen: boolean;
  mode: Mode;
  material?: ClassroomMaterial | null;
  busy: boolean;
  progress: number | null;
  onClose: () => void;
  onSubmit: (data: Values) => Promise<boolean>;
}

export function ClassroomMaterialModal({
  isOpen, mode, material, busy, progress, onClose, onSubmit,
}: ClassroomMaterialModalProps) {
  const { control, handleSubmit, reset } = useForm<Values>({
    defaultValues: { title: "", description: "", file: null },
  });

  useEffect(() => {
    if (isOpen) reset({ title: material?.title ?? "", description: material?.description ?? "", file: null });
  }, [isOpen, material, mode, reset]);

  const submit: SubmitHandler<Values> = async (values) => {
    if (await onSubmit(values)) onClose();
  };

  const names: Record<Mode, string> = {
    create: "Enviar material",
    edit: "Editar informações",
    replace: "Substituir arquivo",
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => { if (!busy) onClose(); }}
      className="w-[min(94vw,38rem)] max-h-[90dvh] overflow-y-auto overscroll-contain max-sm:px-4"
    >
      <ModalTitle title={names[mode]} description={mode === "replace" ? "O arquivo anterior será substituído após salvar." : "Materiais compartilhados com a turma."} />
      <form
        onSubmit={handleSubmit(submit)}
        className="flex flex-col gap-4 max-sm:[&_input]:min-w-0"
      >
        {mode !== "replace" && (
          <>
            <ControlledTextField<Values>
              id="material-title" name="title" label="Título" placeholder="Título do material"
              control={control} rules={{ required: "Informe o título.", maxLength: { value: 150, message: "Máximo de 150 caracteres." } }}
            />
            <Controller name="description" control={control} rules={{ maxLength: { value: 1000, message: "Máximo de 1000 caracteres." } }}
              render={({ field, fieldState }) => (
                <label htmlFor="material-description" className="flex flex-col gap-2 text-slate-700">
                  Descrição
                  <textarea id="material-description" {...field} rows={3}
                    className="rounded-lg border border-slate-300 p-3 text-slate-900" />
                  {fieldState.error && <span className="text-sm text-red-600">{fieldState.error.message}</span>}
                </label>
              )} />
          </>
        )}
        {mode !== "edit" && (
          <ControlledFileField<Values, "file">
            id="material-file" name="file" label={`Arquivo (até ${WEB_UPLOAD_LIMIT_MB} MB)`} control={control}
            accept=".pdf,.png,.jpg,.jpeg,.gif,.webp,.docx,.pptx,.xlsx,.txt,.csv,.md"
            rules={{ required: "Selecione um arquivo.", validate: validateUploadSize }}
            disabled={busy}
          />
        )}
        {progress !== null && (
          <div aria-live="polite">
            <div className="flex justify-between text-sm text-slate-600"><span>Enviando arquivo</span><span>{progress}%</span></div>
            <progress className="w-full" max={100} value={progress} />
          </div>
        )}
        <div className="mt-3 flex flex-col justify-end gap-3 sm:flex-row">
          <div className="sm:min-w-28"><Button type="button" label="Cancelar" variant="muted" disabled={busy} onClick={onClose} /></div>
          <div className="sm:min-w-28"><Button type="submit" label={busy ? "Salvando..." : "Salvar"} disabled={busy} /></div>
        </div>
      </form>
    </Modal>
  );
}
