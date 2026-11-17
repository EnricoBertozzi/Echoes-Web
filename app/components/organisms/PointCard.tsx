import { FiActivity } from "react-icons/fi";

import type { Scenario } from "~/types/Scenario";

import { Button } from "../atoms/Button";
import { Card } from "../atoms/card/Card";
import { PointHeader } from "../molecules/PointHeader";
import { ScenarioCard } from "./ScenarioCard";
import { Accordion } from "../atoms/Accordion";

export interface PointCardProps {
  position: string;
  scenarios: Scenario[];
  onPointEdit: () => void;
  onPointDelete: () => void;
  onScenarioAdd: () => void;
  onScenarioDelete: (scenario: Scenario) => void;
  onScenarioEdit: (scenario: Scenario) => void;
}

export function PointCard({
  position,
  scenarios,
  onPointEdit,
  onPointDelete,
  onScenarioAdd,
  onScenarioDelete,
  onScenarioEdit,
}: PointCardProps) {
  return (
    <Card>
      <div className="flex h-full w-full min-w-0 flex-col gap-6">
        <PointHeader
          onEdit={onPointEdit}
          onDelete={onPointDelete}
          position={position}
        />

        <hr className="border-slate-200" />

        <section className="flex min-w-0 flex-col gap-4">
          <Accordion
            title="Cenários cadastrados"
            subtitle={`${scenarios.length} ${
              scenarios.length === 1
                ? "cenário disponível"
                : "cenários disponíveis"
            }`}
            defaultOpen={false}
          >
            {scenarios.length === 0 ? (
              <EmptyScenarios onAdd={onScenarioAdd} />
            ) : (
              <ul className="flex w-full min-w-0 flex-col gap-4">
                {scenarios.map((scenario) => (
                  <li key={scenario.id} className="w-full min-w-0">
                    <ScenarioCard
                      scenario={scenario}
                      onEdit={() => onScenarioEdit(scenario)}
                      onDelete={() => onScenarioDelete(scenario)}
                    />
                  </li>
                ))}
              </ul>
            )}
            <div className="ml-auto mt-5 w-full max-w-40">
              <Button
                type="button"
                variant="primary"
                label="Novo cenário"
                onClick={onScenarioAdd}
              />
            </div>
          </Accordion>
        </section>
      </div>
    </Card>
  );
}

function EmptyScenarios({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 px-4 py-8 text-center">
      <div className="flex size-14 items-center justify-center rounded-xl bg-slate-100">
        <FiActivity size={26} className="text-slate-400" />
      </div>

      <div className="flex flex-col gap-1">
        <h4 className="font-semibold text-slate-700">
          Nenhum cenário cadastrado
        </h4>

        <p className="text-sm text-slate-500">
          Adicione um cenário clínico a este ponto de ausculta.
        </p>
      </div>

      <button
        type="button"
        onClick={onAdd}
        className="cursor-pointer text-sm font-medium text-main hover:underline"
      >
        Cadastrar primeiro cenário
      </button>
    </div>
  );
}
