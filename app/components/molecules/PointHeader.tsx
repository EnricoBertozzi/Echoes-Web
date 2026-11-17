import { FiEdit, FiMapPin, FiTrash2 } from "react-icons/fi";

import { ButtonIcon } from "../atoms/ButtonIcon";

export interface PointHeaderProps {
  position: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function PointHeader({ position, onEdit, onDelete }: PointHeaderProps) {
  return (
    <header className="flex w-full min-w-0 flex-wrap items-start justify-between gap-4">
      <div className="flex min-w-0 flex-[1_1_12rem] items-start gap-4">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-main">
          <FiMapPin size={32} className="text-white" />
        </div>

        <div className="flex min-w-0 flex-1 flex-col items-start gap-1 text-left">
          <span className="text-sm text-slate-500">Ponto de ausculta</span>

          <h2
            title={position}
            className="w-full wrap-anywhere text-2xl font-bold text-slate-900"
          >
            {position}
          </h2>
        </div>
      </div>

      <div className="ml-auto flex max-w-full shrink-0 flex-wrap items-center gap-8">
        <ButtonIcon onClick={onEdit}>
          <FiEdit size={28} className="text-slate-900" />
        </ButtonIcon>

        <ButtonIcon onClick={onDelete}>
          <FiTrash2 size={28} className="text-red-900" />
        </ButtonIcon>
      </div>
    </header>
  );
}
