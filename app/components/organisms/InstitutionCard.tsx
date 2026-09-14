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
      className="flex w-60 cursor-pointer flex-col gap-3 rounded-2xl bg-white p-6 text-left shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-main">
        <FaSchool size={28} className="text-white" />
      </div>

      <span className="wrap-break-word line-clamp-2 font-bold text-slate-900 text-xl">
        {institution.name}
      </span>

      <span className="text-lg text-slate-500">
        Status:{" "}
        <span
          className={institution.active ? "text-green-700" : "text-red-700"}
        >
          {institution.active ? "Ativo" : "Desativado"}
        </span>
      </span>
    </button>
  );
}
