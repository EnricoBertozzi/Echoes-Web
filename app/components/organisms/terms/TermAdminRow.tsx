import { FiEdit2, FiEye, FiRefreshCw } from "react-icons/fi";

import { TermStatusBadge } from "~/components/atoms/terms/TermStatusBadge";
import type { TermResponseDTO } from "~/types/terms";
import {
  formatTermTimestamp,
  isTermContentEditable,
  isTermStatusEditable,
  termTypeLabels,
} from "~/types/terms";

import { TermListItem } from "./TermListItem";

export interface TermAdminRowProps {
  term: TermResponseDTO;
  mobile?: boolean;
  onView: (term: TermResponseDTO) => void;
  onEdit: (term: TermResponseDTO) => void;
  onChangeStatus: (term: TermResponseDTO) => void;
}

export function TermAdminRow({
  term,
  mobile = false,
  onView,
  onEdit,
  onChangeStatus,
}: TermAdminRowProps) {
  const canEditContent = isTermContentEditable(term.status);
  const canChangeStatus = isTermStatusEditable(term.status);

  const actions = (
    <div className="flex flex-wrap items-center gap-2 lg:justify-center lg:gap-3">
      <button
        type="button"
        aria-label={`Visualizar ${termTypeLabels[term.type]} versão ${term.version}`}
        title="Visualizar"
        className="grid size-11 place-items-center rounded-md border border-slate-200 text-main lg:size-auto lg:border-0 transition-colors hover:text-main/50"
        onClick={() => onView(term)}
      >
        <FiEye size={20} />
      </button>

      <button
        type="button"
        aria-label={`Editar conteúdo de ${termTypeLabels[term.type]} versão ${term.version}`}
        title={
          canEditContent
            ? "Editar conteúdo"
            : "Somente termos em rascunho podem ser editados"
        }
        className="grid size-11 place-items-center rounded-md border border-slate-200 text-main lg:size-auto lg:border-0 transition-colors hover:text-main/50 disabled:cursor-not-allowed disabled:opacity-30"
        disabled={!canEditContent}
        onClick={() => onEdit(term)}
      >
        <FiEdit2 size={20} />
      </button>

      <button
        type="button"
        aria-label={`Alterar status de ${termTypeLabels[term.type]} versão ${term.version}`}
        title={
          canChangeStatus
            ? "Alterar status"
            : "O termo publicado atual não pode mudar de status"
        }
        className="grid size-11 place-items-center rounded-md border border-slate-200 text-main lg:size-auto lg:border-0 transition-colors hover:text-main/50 disabled:cursor-not-allowed disabled:opacity-30"
        disabled={!canChangeStatus}
        onClick={() => onChangeStatus(term)}
      >
        <FiRefreshCw size={20} />
      </button>
    </div>
  );

  if (mobile) return <TermListItem term={term}>{actions}</TermListItem>;

  return (
    <tr className="border-b border-gray-800/10 text-black last:border-b-0">
      <td className="px-4 py-3">{termTypeLabels[term.type]}</td>

      <td className="border-l border-gray-800/10 px-4 py-3">
        {term.version}
      </td>

      <td className="border-l border-gray-800/10 px-4 py-3">
        <TermStatusBadge status={term.status} />
      </td>

      <td className="border-l border-gray-800/10 px-4 py-3">
        {formatTermTimestamp(term.timestamp)}
      </td>

      <td className="border-l border-gray-800/10 px-4 py-3">
        {actions}
      </td>
    </tr>
  );
}
