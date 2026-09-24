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
    <div className="flex gap-8">
      {icon != null && (
        <div className="flex justify-center w-20 h-20 bg-main rounded-2xl min-w-24 min-h-24">
          <img src={icon} alt="" className="w-18" />
        </div>
      )}

      <div className="flex flex-col gap-1 w-2xs max-w-56">
        <h3 className="wrap-break-word font-bold text-slate-900 text-2xl line-clamp-2">
          {title}
        </h3>
        {description != null && (
          <p className="text-slate-500 text-xl line-clamp-1">{description}</p>
        )}
      </div>

      <div className="flex gap-8">
        {onEdit != null && (
          <ButtonIcon onClick={onEdit}>
            <FiEdit size={32} className="text-slate-900" />
          </ButtonIcon>
        )}

        {onDelete != null && (
          <ButtonIcon onClick={onDelete}>
            <FiTrash2 size={32} className="text-red-900" />
          </ButtonIcon>
        )}
      </div>
    </div>
  );
}
