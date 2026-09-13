import { FiEdit, FiTrash2 } from "react-icons/fi";

import { ButtonIcon } from "../atoms/ButtonIcon";
import { PointIcon } from "../atoms/ScenarioIcon";

export interface PointHeaderProps {
  position: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function PointHeader({ position, onEdit, onDelete }: PointHeaderProps) {
  return (
    <div className="flex w-full justify-between gap-8">
      <div className="flex min-w-0 gap-8">
        <PointIcon />

        <div className="w-2xs max-w-56 min-w-0">
          <h3 className="wrap-break-word line-clamp-2 text-2xl font-bold text-slate-900">
            {position}
          </h3>
        </div>
      </div>

      <div className="flex shrink-0 gap-8">
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
