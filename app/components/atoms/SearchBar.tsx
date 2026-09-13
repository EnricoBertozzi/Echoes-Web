import { FaSearch } from "react-icons/fa";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Buscar...",
}: SearchInputProps) {
  return (
    <div
      className="flex w-full max-w-xl items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
      <FaSearch size={24} className="text-slate-500" />

      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-lg text-slate-700 outline-none placeholder:text-slate-500"
      />
    </div>
  );
}
