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
  return (
    <div className="grid grid-cols-3 w-full">
      <div className="flex items-center justify-start gap-2">
        <label htmlFor="pageSize" className="text-sm text-slate-900">
          {label}
        </label>

        <select
          id="pageSize"
          value={size}
          onChange={(e) => {
            onChange(e.target.value);
          }}
          className="rounded-md text-slate-900 border-gray-300 py-2"
        >
          {sizeOptions.map((option) => (
            <option value={option} className="text-slate-900 text-sm">{option}</option>
          ))}
        </select>
      </div>
      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={prevPage}
          disabled={page === 0}
          className="text-slate-900 p-2 disabled:opacity-40"
        >
          <FiChevronLeft />
        </button>

        <span className="text-slate-900">
          Página {totalPages === 0 ? 0 : page + 1} de {totalPages}
        </span>

        <button
          type="button"
          onClick={nextPage}
          disabled={totalPages === 0 || page >= totalPages - 1}
          className="text-slate-900 p-2 disabled:opacity-40"
          aria-label="Próxima página"
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
}
