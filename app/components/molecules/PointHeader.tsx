import { FiEdit, FiMapPin, FiTrash2 } from "react-icons/fi";

import { ButtonIcon } from "../atoms/ButtonIcon";
import { InactiveBadge } from "../atoms/InactiveBadge";
import { ToggleActiveButton } from "./ToggleActiveButton";

export interface PointHeaderProps {
  position: string;
  active: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
}

export function PointHeader({
  position,
  active,
  onEdit,
  onDelete,
  onToggleActive,
}: PointHeaderProps) {
  return (
    <header className="flex w-full min-w-0 items-start gap-3">
      <div className="flex min-w-0 flex-1 flex-wrap items-start gap-4">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-main">
          <FiMapPin size={32} className="text-white" />
        </div>

        <div className="flex min-w-0 flex-[1_1_8rem] flex-col items-start gap-1 text-left">
          <span className="text-sm text-slate-500">Ponto de ausculta</span>

          <h2
            title={position}
            className="w-full wrap-anywhere text-2xl font-bold text-slate-900"
          >
            {position}
          </h2>

          {!active && <InactiveBadge />}
        </div>
      </div>

      <div className="flex shrink-0 gap-1">
        <ButtonIcon label={`Editar ponto ${position}`} onClick={onEdit}>
          <FiEdit size={22} className="text-slate-900" aria-hidden="true" />
        </ButtonIcon>

        <ToggleActiveButton
          active={active}
          subject={`ponto ${position}`}
          onToggle={onToggleActive}
        />

        <ButtonIcon label={`Excluir ponto ${position}`} onClick={onDelete}>
          <FiTrash2 size={22} className="text-red-900" aria-hidden="true" />
        </ButtonIcon>
      </div>
    </header>
  );
}
