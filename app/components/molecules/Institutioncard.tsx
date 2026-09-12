import clsx from "clsx";
import { FaBuilding } from "react-icons/fa";
import { Link } from "react-router";
import type { Institution } from "~/types/Institution";

interface InstitutionCardProps {
  institution: Institution;
}

export function InstitutionCard({ institution }: InstitutionCardProps) {
  return (
    <Link
      to={`/dashboard/school/${institution.id}`}
      className="flex w-56 flex-col gap-3 rounded border border-zinc-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <FaBuilding className="text-2xl text-zinc-800" />
      <span className="font-semibold text-zinc-800">{institution.name}</span>
      <span className="text-sm text-zinc-500">
        Status:{" "}
        <span
          className={clsx(
            "font-medium",
            institution.active ? "text-green-600" : "text-red-600",
          )}
        >
          {institution.active ? "Ativo" : "Desativado"}
        </span>
      </span>
    </Link>
  );
}
