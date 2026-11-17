import { FiEye } from "react-icons/fi";
import { TermStatusBadge } from "~/components/atoms/terms/TermStatusBadge";
import type { TermResponseDTO } from "~/types/terms";
import { formatTermTimestamp, termTypeLabels } from "~/types/terms";

export interface TermTableRowProps {
  term: TermResponseDTO;
  onView: (term: TermResponseDTO) => void;
}

export function TermTableRow({ term, onView }: TermTableRowProps) {
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
          <button
            className='cursor-pointer'
            aria-label={`Visualizar ${termTypeLabels[term.type]}`}
            onClick={() => onView(term)}
          >
            <FiEye
              size={24}
              className='text-main hover:text-main/50 transition-all'
            />
          </button>
        </div>
      </td>
    </tr>
  );
}
