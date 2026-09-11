import { Button } from "../atoms/Button";
import { PointHeader } from "../molecules/PointHeader";

export interface PointCardProps {
  position: string;
  onPointEdit: () => void;
  onPointDelete: () => void;
  onScenarioAdd: () => void;
  onScenarioDelete: () => void;
  onScenarioEdit: () => void;
}

export function PointCard({ position, onPointEdit, onPointDelete, onScenarioAdd, onScenarioDelete, onScenarioEdit}: PointCardProps) {
  return (
    <div className="flex flex-col gap-8 p-8 bg-white rounded-2xl w-full">
      <PointHeader
        onEdit={onPointEdit}
        onDelete={onPointDelete}
        position={position}
      />

    <Button label="Novo Cenário" onClick={onScenarioAdd}/>
    </div>
  );
}
