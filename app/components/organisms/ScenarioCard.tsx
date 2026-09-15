import type { Scenario } from "~/types/Scenario";

import { ScenarioHeader } from "../molecules/ScenarioHeader";

export interface ScenarioCardProps {
  scenario: Scenario;
  onEdit: () => void;
  onDelete: () => void;
}

export function ScenarioCard({
  scenario,
  onEdit,
  onDelete,
}: ScenarioCardProps) {
  return (
    <div className="w-full rounded-xl bg-zinc-100 p-6">
      <ScenarioHeader
        name={scenario.name}
        description={scenario.description}
        audioUrl={scenario.audioPath}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
}
