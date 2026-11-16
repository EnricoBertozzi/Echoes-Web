import clsx from "clsx";
import { Link } from "react-router";
import type { Classroom } from "~/types/Classroom";
import { accentFor, initialsOf } from "~/utils/classroomUi";

export interface ClassroomTileProps {
  classroom: Classroom;
}

/** Bloco de turma, como os blocos de equipe do Teams: banner colorido + dados. */
export function ClassroomTile({ classroom }: ClassroomTileProps) {
  const accent = accentFor(classroom.id, classroom.archived);

  return (
    <Link
      to={`/classrooms/${classroom.id}`}
      className={clsx(
        "group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl bg-white shadow-sm",
        "transition-shadow hover:shadow-md",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main",
      )}
    >
      <div className={clsx("flex h-28 items-end p-5", accent.banner)}>
        <span
          aria-hidden="true"
          className={clsx(
            "flex size-14 items-center justify-center rounded-xl bg-white text-xl font-bold",
            accent.text,
          )}
        >
          {initialsOf(classroom.title)}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="line-clamp-2 text-xl font-bold text-slate-900 group-hover:underline">
          {classroom.title}
        </h3>

        <p className="text-base text-slate-500">Período {classroom.period}</p>

        {classroom.description && (
          <p className="line-clamp-2 text-base text-slate-700">
            {classroom.description}
          </p>
        )}

        <span
          className={clsx(
            "mt-auto w-fit rounded-full px-3 py-1 text-sm font-semibold",
            classroom.archived
              ? "bg-stone-200 text-stone-600"
              : "bg-emerald-100 text-emerald-800",
          )}
        >
          {classroom.archived ? "Arquivada" : "Ativa"}
        </span>
      </div>
    </Link>
  );
}
