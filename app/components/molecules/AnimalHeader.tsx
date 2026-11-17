import { FiEdit, FiTrash2 } from "react-icons/fi";
import { AnimalIcon } from "../atoms/AnimalIcon";
import { ButtonIcon } from "../atoms/ButtonIcon";

export interface AnimalHeaderProps {
  name: string;
  model: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function AnimalHeader({
  name = "Animal",
  model = "Modelo",
  onEdit,
  onDelete,
}: AnimalHeaderProps) {
  return (
    <header className="flex w-full min-w-0 flex-wrap items-start justify-between gap-4">
      <div className="flex min-w-0 flex-[1_1_12rem] items-start gap-4">
        <AnimalIcon />

        <div className="flex min-w-0 flex-1 flex-col items-start gap-1 text-left">
          <h3
            className="w-full line-clamp-2 wrap-anywhere text-2xl font-bold text-slate-900"
            title={name}
          >
            {name}
          </h3>

          <p
            className="w-full line-clamp-1 wrap-anywhere text-xl text-slate-500"
            title={model}
          >
            {model}
          </p>
        </div>
      </div>

      <div className="ml-auto flex max-w-full shrink-0 flex-wrap items-center gap-8">
        <ButtonIcon onClick={onEdit}>
          <FiEdit size={32} className="text-slate-900" />
        </ButtonIcon>

        <ButtonIcon onClick={onDelete}>
          <FiTrash2 size={32} className="text-red-900" />
        </ButtonIcon>
      </div>
    </header>
  );
}
