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
    <article className="flex w-full min-w-0 flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-slate-300 sm:p-6">
      <ScenarioHeader
        name={scenario.name}
        description={scenario.description}
        audioUrl={scenario.audioPath}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </article>
  );
}
