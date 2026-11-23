import { useEffect, useState } from "react";
import { Button } from "~/components/atoms/Button";
import { InactiveBadge } from "~/components/atoms/InactiveBadge";
import { SelectInput } from "~/components/atoms/input/SelectInput";
import type { Scenario } from "~/types/Scenario";
import type { PointConfig } from "~/types/deviceScenario";

interface PointScenarioCardProps {
  point: PointConfig;
  scenarios: Scenario[];
  busy: boolean;
  onApply: (scenarioId: string) => Promise<boolean>;
}

export function PointScenarioCard({
  point,
  scenarios,
  busy,
  onApply,
}: PointScenarioCardProps) {
  const currentScenarioId = point.scenario?.id ?? "";
  const [selected, setSelected] = useState(currentScenarioId);

  useEffect(() => {
    setSelected(currentScenarioId);
  }, [currentScenarioId, point.pointId]);

  const options = new Map(
    scenarios.map((scenario) => [scenario.id, scenario.name]),
  );
  const selectId = `scenario-${point.pointId}`;
  const canApply =
    selected !== "" && selected !== currentScenarioId && !busy;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 p-3 sm:p-5">
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="text-lg font-bold text-slate-900">
          Ponto: {point.position}
        </h3>

        {point.active === false && <InactiveBadge />}

        {point.sensorIndex !== null && (
          <span className="rounded-full bg-slate-200 px-2 py-0.5 text-sm font-semibold text-slate-700">
            Sensor {point.sensorIndex}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-slate-600">
          Atual:{" "}
          {point.scenario ? (
            <span className="font-medium text-slate-900">
              {point.scenario.name}
            </span>
          ) : (
            <span className="text-slate-500">
              Nenhum cenário selecionado
            </span>
          )}
        </p>

        {point.scenario?.description && (
          <p className="text-sm text-slate-500">
            {point.scenario.description}
          </p>
        )}
      </div>

      {point.active === false ? (
        <p className="text-slate-500">
          Ponto de ausculta desativado: não aceita novas escolhas de cenário.
        </p>
      ) : scenarios.length === 0 ? (
        <p className="text-slate-500">
          Nenhum cenário ativo cadastrado para este ponto.
        </p>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="min-w-0 flex-1">
            <label htmlFor={selectId} className="sr-only">
              Cenário do ponto {point.position}
            </label>
            <SelectInput
              id={selectId}
              name={selectId}
              placeholder="Escolha um cenário"
              options={options}
              value={selected}
              disablePlaceholder={false}
              onChange={(event) => setSelected(event.target.value)}
            />
          </div>

          <div className="w-full sm:w-36">
            <Button
              type="button"
              label={busy ? "Aplicando..." : "Aplicar"}
              disabled={!canApply}
              onClick={() => void onApply(selected)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
