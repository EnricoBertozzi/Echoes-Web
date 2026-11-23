import { FiEye } from "react-icons/fi";
import { TermStatusBadge } from "~/components/atoms/terms/TermStatusBadge";
import type { TermResponseDTO } from "~/types/terms";
import { formatTermTimestamp, termTypeLabels } from "~/types/terms";

import { TermListItem } from "./terms/TermListItem";

export interface TermTableRowProps {
  term: TermResponseDTO;
  mobile?: boolean;
  onView: (term: TermResponseDTO) => void;
}

export function TermTableRow({ term, onView, mobile = false }: TermTableRowProps) {
  const viewAction = (
    <button
      type="button"
      className="inline-flex min-h-11 items-center gap-2 rounded-md px-2 text-main transition-colors hover:text-main/70 lg:min-h-0 lg:px-0"
      aria-label={`Visualizar ${termTypeLabels[term.type]}`}
      onClick={() => onView(term)}
    >
      <FiEye size={24} aria-hidden="true" />
      <span className="lg:hidden">Visualizar</span>
    </button>
  );

  if (mobile) return <TermListItem term={term}>{viewAction}</TermListItem>;

  return (
    <tr className='text-black border-t border-b border-gray-800/20'>
      <td className='w-1/3 px-4 py-2'>
        {termTypeLabels[term.type]}
      </td>

      <td className='w-1/6 px-4 py-2 border-l border-gray-800/20'>
        {term.version}
      </td>

      <td className='w-1/6 px-4 py-2 border-l border-gray-800/20'>
        <TermStatusBadge status={term.status} />
      </td>

      <td className='w-1/4 px-4 py-2 border-l border-gray-800/20'>
        {formatTermTimestamp(term.timestamp)}
      </td>

      <td className='w-1/12 px-4 py-2 border-l border-gray-800/20'>
        <div className='flex w-full flex-col justify-center items-center'>
          {viewAction}
        </div>
      </td>
    </tr>
  );
}
