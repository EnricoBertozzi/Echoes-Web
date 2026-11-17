import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "~/components/atoms/Button";
import { Label } from "~/components/atoms/input/Label";
import { Modal } from "~/components/atoms/modal/Modal";
import { ModalTitle } from "~/components/atoms/modal/ModalTitle";
import { Alert } from "~/components/atoms/page/Alert";
import { SelectField } from "~/components/molecules/input/SelectField";
import { MarkdownEditor } from "~/components/molecules/terms/MarkdownEditor";
import type {
  CreateTermRequest,
  TermResponseDTO,
  TermStatus,
  TermType,
} from "~/types/terms";
import {
  canPublishTermVersion,
  isValidTermVersion,
  suggestNextTermVersion,
  termStatusLabels,
  termStatuses,
  termTypeLabels,
  termTypes,
} from "~/types/terms";

const createStatuses = termStatuses.filter((status) => status !== "ARCHIVED");

const typeOptions = new Map<string, string>(
  termTypes.map((type) => [type, termTypeLabels[type]]),
);

const statusOptions = new Map<string, string>(
  createStatuses.map((status) => [status, termStatusLabels[status]]),
);

interface FormValues {
  type: TermType;
  version: string;
  status: TermStatus;
  content: string;
}

const defaultValues: FormValues = {
  type: "TERMS_OF_USE",
  version: "1.0.0",
  status: "DRAFT",
  content: "",
};

export interface TermCreateModalProps {
  isOpen: boolean;
  busy: boolean;
  publishedByType: Map<TermType, TermResponseDTO>;
  onClose: () => void;
  onCreate: (data: CreateTermRequest) => Promise<boolean>;
}

export function TermCreateModal({
  isOpen,
  busy,
  publishedByType,
  onClose,
  onCreate,
}: TermCreateModalProps) {
  const { control, handleSubmit, reset, watch, setValue } = useForm<FormValues>({
    defaultValues,
  });

  const selectedType = watch("type");
  const selectedStatus = watch("status");
  const selectedVersion = watch("version");

  const currentPublished = publishedByType.get(selectedType);
  const isRequiredType = selectedType !== "PROCESSING_OPERATIONS";
  const willPublish = selectedStatus === "PUBLISHED";
  const versionIsGreater = canPublishTermVersion(
    selectedVersion,
    currentPublished?.version,
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const published = publishedByType.get(defaultValues.type);

    reset({
      ...defaultValues,
      version: suggestNextTermVersion(published?.version),
    });
  }, [isOpen, publishedByType, reset]);

  function changeType(type: TermType) {
    const published = publishedByType.get(type);

    setValue("version", suggestNextTermVersion(published?.version));
  }

  async function submit(values: FormValues) {
    if (await onCreate(values)) {
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
        title="Novo termo"
        description="Crie um rascunho para revisar depois ou publique uma nova versão imediatamente."
      />

      <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-5">
        <div className="grid gap-4 md:grid-cols-3">
          <Controller
            name="type"
            control={control}
            rules={{ required: "O tipo é obrigatório." }}
            render={({ field, fieldState }) => (
              <SelectField
                id="term-type"
                name={field.name}
                label="Tipo"
                placeholder="Selecione o tipo"
                options={typeOptions}
                value={field.value}
                error={fieldState.error?.message}
                onChange={(event) => {
                  field.onChange(event);
                  changeType(event.target.value as TermType);
                }}
                onBlur={field.onBlur}
              />
            )}
          />

          <Controller
            name="version"
            control={control}
            rules={{
              required: "A versão é obrigatória.",
              validate: (value) =>
                isValidTermVersion(value) ||
                "Use o formato major.minor.patch, por exemplo 2.1.0.",
            }}
            render={({ field, fieldState }) => (
              <div className="flex flex-col gap-2">
                <Label id="term-version" name={field.name} label="Versão" />
                <input
                  id="term-version"
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="2.1.0"
                  className={`
                    w-full rounded-lg border px-4 py-3 text-slate-900
                    placeholder-slate-400 transition-colors focus:outline-none
                    ${
                      fieldState.error
                        ? "border-red-500 focus:border-red-600"
                        : "border-slate-300 focus:border-slate-500"
                    }
                  `}
                />
                {fieldState.error && (
                  <span className="text-sm text-red-500">
                    {fieldState.error.message}
                  </span>
                )}
              </div>
            )}
          />

          <Controller
            name="status"
            control={control}
            rules={{ required: "O status é obrigatório." }}
            render={({ field, fieldState }) => (
              <SelectField
                id="term-status"
                name={field.name}
                label="Status inicial"
                placeholder="Selecione o status"
                options={statusOptions}
                value={field.value}
                error={fieldState.error?.message}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />
        </div>

        <p className="text-sm text-slate-500">
          {currentPublished
            ? `Versão publicada atual de ${termTypeLabels[selectedType]}: ${currentPublished.version}.`
            : `Ainda não há termo publicado de ${termTypeLabels[selectedType]}.`}
        </p>

        {willPublish && !versionIsGreater && (
          <Alert
            type="error"
            message={`Para publicar, a versão precisa ser maior que a publicada atual${currentPublished ? ` (${currentPublished.version})` : ""}.`}
          />
        )}

        {willPublish && (
          <Alert
            type="muted"
            message={
              isRequiredType
                ? "Ao publicar, a versão anterior deste tipo será arquivada e todos os usuários precisarão aceitar a nova versão antes de voltar a usar o sistema."
                : "Ao publicar, a versão anterior deste tipo será arquivada. Este tipo não entra no aceite obrigatório."
            }
          />
        )}

        <Controller
          name="content"
          control={control}
          rules={{
            validate: (value) =>
              value.trim().length > 0 || "O conteúdo é obrigatório.",
          }}
          render={({ field, fieldState }) => (
            <MarkdownEditor
              id="term-create-content"
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

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            label="Cancelar"
            variant="muted"
            disabled={busy}
            onClick={onClose}
          />
          <Button
            type="submit"
            label={busy ? "Criando..." : willPublish ? "Publicar termo" : "Criar termo"}
            disabled={busy || (willPublish && !versionIsGreater)}
          />
        </div>
      </form>
    </Modal>
  );
}
