import { FiArrowRight } from "react-icons/fi";
import { Card } from "../atoms/card/Card";
import { Text } from "../atoms/Text";
import { AnimalHeader } from "../molecules/AnimalHeader";

export interface AnimalCardProps {
  name: string;
  model: string;
  description: string;
  active: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
  onOpen: () => void;
}

export function AnimalCard({
  name,
  model,
  description,
  active,
  onEdit,
  onDelete,
  onToggleActive,
  onOpen,
}: AnimalCardProps) {
  return (
    <Card>
      <div className="flex h-full w-full min-w-0 flex-col gap-4">
        <AnimalHeader
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleActive={onToggleActive}
          name={name}
          model={model}
          active={active}
        />

        <div className="min-w-0 wrap-anywhere">
          <Text text={description} />
        </div>

        <button
          type="button"
          onClick={onOpen}
          className="mt-auto flex w-full min-w-0 cursor-pointer items-center justify-between gap-3 text-left font-medium text-main hover:underline"
        >
          <span className="min-w-0 wrap-anywhere text-base">
            Gerenciar pontos de ausculta
          </span>

          <FiArrowRight size={20} className="shrink-0" />
        </button>
      </div>
    </Card>
  );
}
