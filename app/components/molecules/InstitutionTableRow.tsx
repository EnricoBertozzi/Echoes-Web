import clsx from "clsx";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { Button } from "~/components/atoms/Button";
import { formatCnpj } from "~/utils/cnpj";
import type { Institution } from "~/types/Institution";

interface InstitutionTableRowProps {
  institution: Institution;
  onEdit: (institution: Institution) => void;
  onDelete: (institution: Institution) => void;
  onToggleStatus: (institution: Institution) => void;
  toggling?: boolean;
}

export function InstitutionTableRow({
  institution,
  onEdit,
  onDelete,
  onToggleStatus,
  toggling = false,
}: InstitutionTableRowProps) {
  return (
    <tr className="border-b border-zinc-200 text-sm text-zinc-700">
      <td className="px-4 py-3 font-medium">{institution.name}</td>
      <td className="px-4 py-3">{institution.acronym}</td>
      <td className="px-4 py-3">{formatCnpj(institution.cnpj)}</td>
      <td className="px-4 py-3">{institution.email}</td>
      <td className="px-4 py-3">{institution.phone ?? "—"}</td>
      <td className="px-4 py-3">
        <button
          type="button"
          onClick={() => onToggleStatus(institution)}
          disabled={toggling}
          className={clsx(
            "cursor-pointer rounded-full px-3 py-1 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-40",
            institution.active
              ? "bg-green-100 text-green-700"
              : "bg-zinc-200 text-zinc-600",
          )}
        >
          {institution.active ? "Ativa" : "Inativa"}
        </button>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            className="px-2 py-1"
            onClick={() => onEdit(institution)}
            aria-label={`Editar ${institution.name}`}
          >
            <FiEdit2 />
          </Button>
          <Button
            variant="danger"
            className="px-2 py-1"
            onClick={() => onDelete(institution)}
            aria-label={`Excluir ${institution.name}`}
          >
            <FiTrash2 />
          </Button>
        </div>
      </td>
    </tr>
  );
}
