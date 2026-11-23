import { useEffect } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { Button } from "~/components/atoms/Button";
import { Modal } from "~/components/atoms/modal/Modal";
import { ModalTitle } from "~/components/atoms/modal/ModalTitle";
import { ControlledSelectField } from "~/components/molecules/controlled/ControlledSelectField";
import { ControlledTextField } from "~/components/molecules/controlled/ControlledTextField";
import type { Scenario } from "~/types/Scenario";
import type {
  ClinicalPresetRequest,
  PointConfig,
  PresetPoint,
} from "~/types/deviceScenario";

interface Values {
  name: string;
  description: string;
  points: PresetPoint[];
}

export interface ClinicalPresetModalProps {
  isOpen: boolean;
  points: PointConfig[];
  scenariosByPoint: Map<string, Scenario[]>;
  busy: boolean;
  onClose: () => void;
  onSubmit: (data: ClinicalPresetRequest) => Promise<boolean>;
}

export function ClinicalPresetModal({
  isOpen,
  points,
  scenariosByPoint,
  busy,
  onClose,
  onSubmit,
}: ClinicalPresetModalProps) {
  const { control, handleSubmit, reset } = useForm<Values>({
    defaultValues: {
      name: "",
      description: "",
      points: points.map((point) => ({
        pointId: point.pointId,
        scenarioId: "",
      })),
    },
  });

  useEffect(() => {
    if (!isOpen) return;

    reset({
      name: "",
      description: "",
      points: points.map((point) => ({
        pointId: point.pointId,
        scenarioId: "",
      })),
    });
  }, [isOpen, points, reset]);

  const submit: SubmitHandler<Values> = async (values) => {
    const description = values.description.trim();
    const data: ClinicalPresetRequest = {
      name: values.name.trim(),
      points: values.points.map((point) => ({
        pointId: point.pointId,
        scenarioId: point.scenarioId,
      })),
    };

    if (description) data.description = description;

    if (await onSubmit(data)) onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (!busy) onClose();
      }}
      className="w-[min(94vw,38rem)] max-h-[90dvh] overflow-y-auto"
    >
      <ModalTitle
        title="Novo cenário clínico"
        description="Escolha um cenário para cada ponto de ausculta."
      />

      <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
        <ControlledTextField<Values>
          id="preset-name"
          name="name"
          label="Nome"
          placeholder="Nome do cenário clínico"
          control={control}
          rules={{
            required: "Informe o nome.",
            maxLength: { value: 100, message: "Máximo de 100 caracteres." },
          }}
        />

        <Controller
          name="description"
          control={control}
          rules={{
            maxLength: { value: 255, message: "Máximo de 255 caracteres." },
          }}
          render={({ field, fieldState: { error } }) => (
            <label
              htmlFor="preset-description"
              className="flex flex-col gap-2 text-slate-700"
            >
              Descrição
              <textarea
                id="preset-description"
                {...field}
                rows={3}
                className="rounded-lg border border-slate-300 p-3 text-slate-900"
              />
              {error && (
                <span className="text-sm text-red-600">{error.message}</span>
              )}
            </label>
          )}
        />

        {points.map((point, index) => {
          const options = new Map(
            (scenariosByPoint.get(point.pointId) ?? []).map((scenario) => [
              scenario.id,
              scenario.name,
            ]),
          );

          return (
            <ControlledSelectField<Values>
              key={point.pointId}
              id={`preset-point-${point.pointId}`}
              name={`points.${index}.scenarioId`}
              label={`Cenário do ponto ${point.position}`}
              placeholder="Escolha um cenário"
              options={options}
              control={control}
              rules={{ required: "Escolha um cenário para este ponto." }}
            />
          );
        })}

        <p className="text-sm text-slate-500">
          O cenário clínico fica disponível para todos os dispositivos com este
          animal e não pode ser editado nem excluído depois de salvo.
        </p>

        <div className="mt-3 flex flex-col justify-end gap-3 sm:flex-row">
          <div className="sm:min-w-28">
            <Button
              type="button"
              label="Cancelar"
              variant="muted"
              disabled={busy}
              onClick={onClose}
            />
          </div>
          <div className="sm:min-w-28">
            <Button
              type="submit"
              label={busy ? "Salvando..." : "Salvar"}
              disabled={busy}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}
