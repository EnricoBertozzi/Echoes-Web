import { useId } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export interface PaginationSelectorProps {
  label: string,
  page: number;
  totalPages: number;
  size: number,
  sizeOptions: number[],
  nextPage: () => void;
  prevPage: () => void;
  onChange: (value: string) => void;
}

export function PaginationSelector({
  label,
  page,
  totalPages,
  size,
  sizeOptions,
  prevPage,
  nextPage,
  onChange
}: PaginationSelectorProps) {
  const pageSizeId = useId();

  return (
    <div className="grid w-full gap-y-1 md:grid-cols-3">
      <div className="flex items-center justify-start gap-2">
        <label htmlFor={pageSizeId} className="text-sm text-slate-900">
          {label}
        </label>

        <select
          id={pageSizeId}
          value={size}
          onChange={(e) => {
            onChange(e.target.value);
          }}
          className="rounded-md text-slate-900 border-gray-300 py-2"
        >
          {sizeOptions.map((option) => (
            <option key={option} value={option} className="text-slate-900 text-sm">{option}</option>
          ))}
        </select>
      </div>
      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={prevPage}
          disabled={page === 0}
          className="grid size-11 shrink-0 place-items-center text-slate-900 disabled:opacity-40"
          aria-label="Página anterior"
        >
          <FiChevronLeft />
        </button>

        <span className="text-center text-slate-900">
          Página {totalPages === 0 ? 0 : page + 1} de {totalPages}
        </span>

        <button
          type="button"
          onClick={nextPage}
          disabled={totalPages === 0 || page >= totalPages - 1}
          className="grid size-11 shrink-0 place-items-center text-slate-900 disabled:opacity-40"
          aria-label="Próxima página"
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
}
