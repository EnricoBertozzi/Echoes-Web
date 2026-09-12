import type { Scenario } from "~/types/Scenario";
import { Button } from "../atoms/Button";
import { PointHeader } from "../molecules/PointHeader";
import { ScenarioCard } from "./ScenarioCard";

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
    <div className="flex flex-col gap-8 p-8 bg-white rounded-2xl w-full">
      <PointHeader
        onEdit={onPointEdit}
        onDelete={onPointDelete}
        position={position}
      />

      <div className="flex w-full flex-col gap-4">
        {scenarios.map((scenario) => (
          <ScenarioCard
            key={scenario.id}
            scenario={scenario}
            onEdit={() => onScenarioEdit(scenario)}
            onDelete={() => onScenarioDelete(scenario)}
          />
        ))}
      </div>

      <Button label="Novo Cenário" onClick={onScenarioAdd} />
    </div>
  );
}
