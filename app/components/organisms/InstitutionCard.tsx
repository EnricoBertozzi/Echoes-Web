import { FaSchool } from "react-icons/fa";
import type { Institution } from "~/types/Institution";

export interface InstitutionCardProps {
  institution: Institution;
  onOpen: () => void;
}

export function InstitutionCard({ institution, onOpen }: InstitutionCardProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="grid h-full w-full min-w-0 cursor-pointer grid-cols-[auto_minmax(0,1fr)] items-start gap-4 rounded-2xl bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md sm:flex sm:flex-col sm:p-6"
    >
      <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-main sm:size-16">
        <FaSchool className="size-6 text-white sm:size-7" aria-hidden="true" />
      </span>

      <span className="flex w-full min-w-0 flex-col gap-2">
        <span className="text-xl leading-snug font-bold text-slate-900 wrap-anywhere">
          {institution.name}
        </span>

        <span className="text-base text-slate-500 sm:text-lg">
          Status:{" "}
          <span className={institution.active ? "text-green-700" : "text-red-700"}>
            {institution.active ? "Ativo" : "Desativado"}
          </span>
        </span>
      </span>
    </button>
  );
}
