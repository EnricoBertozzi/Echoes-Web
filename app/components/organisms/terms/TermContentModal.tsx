import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "~/components/atoms/Button";
import { Modal } from "~/components/atoms/modal/Modal";
import { ModalTitle } from "~/components/atoms/modal/ModalTitle";
import { MarkdownEditor } from "~/components/molecules/terms/MarkdownEditor";
import type { TermResponseDTO } from "~/types/terms";
import { termTypeLabels } from "~/types/terms";

interface FormValues {
  content: string;
}

export interface TermContentModalProps {
  isOpen: boolean;
  term: TermResponseDTO | null;
  busy: boolean;
  onClose: () => void;
  onSave: (content: string) => Promise<boolean>;
}

/**
 * Edição do conteúdo de um termo DRAFT, com textarea à esquerda e preview
 * Markdown à direita.
 */
export function TermContentModal({
  isOpen,
  term,
  busy,
  onClose,
  onSave,
}: TermContentModalProps) {
  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: { content: "" },
  });

  useEffect(() => {
    if (isOpen) {
      reset({ content: term?.content ?? "" });
    }
  }, [isOpen, term, reset]);

  async function submit(values: FormValues) {
    if (await onSave(values.content)) {
      onClose();
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (!busy) onClose();
      }}
      className="max-h-[92vh] w-[min(96vw,80rem)] overflow-y-auto"
    >
      <ModalTitle
        title={term ? `Editar conteúdo — ${termTypeLabels[term.type]}` : "Editar conteúdo"}
        description={
          term
            ? `Versão ${term.version}. Somente termos em rascunho podem ser editados.`
            : "Somente termos em rascunho podem ser editados."
        }
      />

      <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-5">
        <Controller
          name="content"
          control={control}
          rules={{
            validate: (value) =>
              value.trim().length > 0 || "O conteúdo é obrigatório.",
          }}
          render={({ field, fieldState }) => (
            <MarkdownEditor
              id="term-content"
              name={field.name}
              label="Conteúdo (Markdown)"
              value={field.value}
              error={fieldState.error?.message}
              readOnly={busy}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />

        <div className="flex flex-col justify-end gap-3 sm:flex-row">
          <Button
            type="button"
            label="Cancelar"
            variant="muted"
            disabled={busy}
            onClick={onClose}
          />
          <Button
            type="submit"
            label={busy ? "Salvando..." : "Salvar conteúdo"}
            disabled={busy}
          />
        </div>
      </form>
    </Modal>
  );
}
