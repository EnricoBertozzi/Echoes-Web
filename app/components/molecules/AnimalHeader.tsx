import { FiEdit, FiTrash2 } from "react-icons/fi";
import { AnimalIcon } from "../atoms/AnimalIcon";
import { ButtonIcon } from "../atoms/ButtonIcon";

export interface AnimalHeaderProps {
  name: string;
  model: string;
  onEdit: () => any;
  onDelete: () => any;
}

export function AnimalHeader({name = "Animal", model="Modelo", onEdit, onDelete}: AnimalHeaderProps) {
  return (
    <div className="flex gap-8">
      <AnimalIcon />
      
      <div className="flex flex-col gap-1 w-2xs max-w-56">
        <h3 className="wrap-break-word font-bold text-slate-900 text-2xl line-clamp-2">
          {name}
        </h3>
        <p className="text-slate-500 text-xl line-clamp-1">{model}</p>
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
