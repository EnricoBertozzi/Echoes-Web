import { FiEdit, FiTrash2 } from "react-icons/fi";
import { Button } from "~/components/atoms/Button";
import { ButtonIcon } from "~/components/atoms/ButtonIcon";
import { Card } from "~/components/atoms/card/Card";
import type { Classroom } from "~/types/Classroom";

export interface ClassroomCardProps {
  classroom: Classroom;
  onOpen: () => void;
  management?: {
    onEdit: (classroom: Classroom) => void;
    onDelete: (classroom: Classroom) => void;
    onToggleArchive: (classroom: Classroom) => void;
  };
}

export function ClassroomCard({ classroom, onOpen, management }: ClassroomCardProps) {
  const { title, description, period, archived } = classroom;

  return (
    <Card className="max-lg:p-4">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-2xl font-bold text-slate-900 wrap-anywhere">
            {title}
          </h3>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <p className="min-w-0 text-xl text-slate-500 wrap-anywhere">
              Período: {period}
            </p>
            <span
              className={`rounded-full px-3 py-1 text-sm font-semibold ${
                archived
                  ? "bg-stone-200 text-stone-600"
                  : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {archived ? "Arquivada" : "Ativa"}
            </span>
          </div>
        </div>

        {management && (
          <div className="flex shrink-0 gap-1">
            <ButtonIcon
              label={`Editar turma ${title}`}
              disabled={archived}
              onClick={() => management.onEdit(classroom)}
            >
              <FiEdit size={22} className="text-slate-900" aria-hidden="true" />
            </ButtonIcon>
            <ButtonIcon
              label={`Excluir turma ${title}`}
              onClick={() => management.onDelete(classroom)}
            >
              <FiTrash2 size={22} className="text-red-900" aria-hidden="true" />
            </ButtonIcon>
          </div>
        )}
      </div>

      {description && (
        <p className="line-clamp-3 text-lg text-slate-700 wrap-anywhere">
          {description}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <div className="w-28">
          <Button
            type="button"
            label="Abrir"
            aria-label={`Abrir turma ${title}`}
            onClick={onOpen}
          />
        </div>

        {management && (
          <div className="w-32">
            <Button
              type="button"
              label={archived ? "Desarquivar" : "Arquivar"}
              variant="muted"
              onClick={() => management.onToggleArchive(classroom)}
            />
          </div>
        )}
      </div>
    </Card>
  );
}
