import { Button } from "~/components/atoms/Button";
import { useConfirmation } from "~/context/ConfirmationContext";
import type { Scenario } from "~/types/Scenario";
import type { ClinicalPreset, PointConfig } from "~/types/deviceScenario";

interface ClinicalPresetCardProps {
  preset: ClinicalPreset;
  points: PointConfig[];
  scenariosByPoint: Map<string, Scenario[]>;
  canActivate: boolean;
  busy: boolean;
  onActivate: (presetId: string) => Promise<boolean>;
}

export function ClinicalPresetCard({
  preset,
  points,
  scenariosByPoint,
  canActivate,
  busy,
  onActivate,
}: ClinicalPresetCardProps) {
  const confirmAction = useConfirmation();
  const selected = new Map(
    preset.points.map((point) => [point.pointId, point.scenarioId]),
  );
  const inUse =
    points.length > 0 &&
    points.every(
      (point) =>
        selected.has(point.pointId) &&
        selected.get(point.pointId) === (point.scenario?.id ?? null),
    );

  function scenarioName(pointId: string, scenarioId: string): string {
    return (
      scenariosByPoint
        .get(pointId)
        ?.find((scenario) => scenario.id === scenarioId)?.name ??
      "Cenário removido"
    );
  }

  async function handleActivate() {
    if (!canActivate || inUse || busy) return;

    const confirmed = await confirmAction({
      title: "Aplicar cenário clínico",
      description: `Aplicar o cenário clínico “${preset.name}”? Os cenários de todos os pontos serão substituídos.`,
      confirmLabel: "Aplicar",
    });

    if (confirmed) void onActivate(preset.id);
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 p-3 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3
            className="line-clamp-2 text-lg font-bold text-slate-900"
            title={preset.name}
          >
            {preset.name}
          </h3>

          {preset.description && (
            <p className="break-words text-slate-600">{preset.description}</p>
          )}
        </div>

        <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
          {inUse && (
            <span className="text-sm font-semibold text-green-700">
              Em uso
            </span>
          )}

          <div className="w-full sm:w-36">
            <Button
              type="button"
              label={busy ? "Ativando..." : "Ativar"}
              disabled={!canActivate || inUse || busy}
              title={
                !canActivate ? "O dispositivo precisa estar ativo." : undefined
              }
              onClick={handleActivate}
            />
          </div>
        </div>
      </div>

      <ul className="flex flex-col gap-1 text-sm text-slate-600">
        {preset.points.map((point) => (
          <li key={point.pointId} className="break-words">
            {points.find((item) => item.pointId === point.pointId)?.position ??
              "Ponto"}{" "}
            → {scenarioName(point.pointId, point.scenarioId)}
          </li>
        ))}
      </ul>
    </div>
  );
}
