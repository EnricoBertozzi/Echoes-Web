import type { Scenario } from "~/types/Scenario";

import { Button } from "../atoms/Button";
import { Card } from "../atoms/card/Card";
import { PointHeader } from "../molecules/PointHeader";
import { ScenarioCard } from "./ScenarioCard";
import { Accordion } from "../atoms/Accordion";

export interface PointCardProps {
  position: string;
  active: boolean;
  scenarios: Scenario[];
  onPointEdit: () => void;
  onPointDelete: () => void;
  onPointToggleActive: () => void;
  onScenarioAdd: () => void;
  onScenarioDelete: (scenario: Scenario) => void;
  onScenarioEdit: (scenario: Scenario) => void;
  onScenarioToggleActive: (scenario: Scenario) => void;
}

export function PointCard({
  position,
  active,
  scenarios,
  onPointEdit,
  onPointDelete,
  onPointToggleActive,
  onScenarioAdd,
  onScenarioDelete,
  onScenarioEdit,
  onScenarioToggleActive,
}: PointCardProps) {
  return (
    <Card>
      <div className="flex h-full w-full min-w-0 flex-col gap-6">
        <PointHeader
          onEdit={onPointEdit}
          onDelete={onPointDelete}
          onToggleActive={onPointToggleActive}
          position={position}
          active={active}
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
              <p className="rounded-xl border border-dashed border-slate-300 px-4 py-4 text-center font-semibold text-slate-700">
                Nenhum cenário cadastrado
              </p>
            ) : (
              <ul className="flex w-full min-w-0 flex-col gap-4">
                {scenarios.map((scenario) => (
                  <li key={scenario.id} className="w-full min-w-0">
                    <ScenarioCard
                      scenario={scenario}
                      onEdit={() => onScenarioEdit(scenario)}
                      onDelete={() => onScenarioDelete(scenario)}
                      onToggleActive={() => onScenarioToggleActive(scenario)}
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
