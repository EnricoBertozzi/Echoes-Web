import { FiEdit, FiTrash2 } from "react-icons/fi";
import { AnimalIcon } from "../atoms/AnimalIcon";
import { ButtonIcon } from "../atoms/ButtonIcon";

export interface ScenarioHeaderProps {
  name: string;
  description: string;
  audioUrl: string;
  onEdit: () => any;
  onDelete: () => any;
}

export function ScenarioHeader({
  name,
  description,
  audioUrl,
  onEdit,
  onDelete,
}: ScenarioHeaderProps) {
  return (
    <div className="flex w-full justify-between gap-8">
      <div className="flex min-w-0 flex-col gap-1">
        <h3 className="wrap-break-word font-bold text-slate-900 text-2xl line-clamp-2">
          {name}
        </h3>
        <p className="text-slate-500 text-xl line-clamp-1">{description}</p>
        <p className="text-slate-500 text-xl line-clamp-1">{`Arquivo: ${audioUrl}`}</p>
      </div>

      <div className="flex gap-8">
        <ButtonIcon onClick={onEdit}>
          <FiEdit size={32} className="text-slate-900" />
        </ButtonIcon>
        <ButtonIcon onClick={onDelete}>
          <FiTrash2 size={32} className="text-red-900" />
        </ButtonIcon>
      </div>
    </div>
  );
}
