import { FiEdit, FiTrash2 } from "react-icons/fi";
import { ButtonIcon } from "../ButtonIcon";

export interface CardHeaderProps {
  icon?: string;
  title: string;
  description?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function CardHeader({ icon, title, description, onEdit, onDelete }: CardHeaderProps) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <div className="flex min-w-0 flex-1 flex-wrap items-start gap-4">
        {icon != null && (
          <div className="flex size-24 shrink-0 justify-center rounded-2xl bg-main">
            <img src={icon} alt="" className="w-18" />
          </div>
        )}

        <div className="flex min-w-0 max-w-56 flex-[1_1_8rem] flex-col gap-1">
          <h3 className="line-clamp-2 text-2xl font-bold text-slate-900 wrap-anywhere">
            {title}
          </h3>
          {description != null && (
            <p className="line-clamp-1 text-xl text-slate-500 wrap-anywhere">{description}</p>
          )}
        </div>
      </div>

      {(onEdit || onDelete) && (
        <div className="flex shrink-0 gap-1">
          {onEdit && (
            <ButtonIcon label={`Editar ${title}`} onClick={onEdit}>
              <FiEdit size={22} className="text-slate-900" aria-hidden="true" />
            </ButtonIcon>
          )}

          {onDelete && (
            <ButtonIcon label={`Excluir ${title}`} onClick={onDelete}>
              <FiTrash2 size={22} className="text-red-900" aria-hidden="true" />
            </ButtonIcon>
          )}
        </div>
      )}
    </div>
  );
}
