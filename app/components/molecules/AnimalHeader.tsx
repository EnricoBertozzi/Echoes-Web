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
    <header className="flex w-full min-w-0 items-start gap-3">
      <div className="flex min-w-0 flex-1 flex-wrap items-start gap-4">
        <AnimalIcon />

        <div className="flex min-w-0 flex-[1_1_8rem] flex-col items-start gap-1 text-left">
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

      <div className="flex shrink-0 gap-1">
        <ButtonIcon label={`Editar animal ${name}`} onClick={onEdit}>
          <FiEdit size={22} className="text-slate-900" aria-hidden="true" />
        </ButtonIcon>

        <ButtonIcon label={`Excluir animal ${name}`} onClick={onDelete}>
          <FiTrash2 size={22} className="text-red-900" aria-hidden="true" />
        </ButtonIcon>
      </div>
    </header>
  );
}
