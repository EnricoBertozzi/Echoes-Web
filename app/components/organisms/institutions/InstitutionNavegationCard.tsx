import type { IconType } from "react-icons";
import { FiArrowUpRight } from "react-icons/fi";

interface InstitutionNavigationCardProps {
  icon: IconType;
  title: string;
  description: string;
  onClick: () => void;
}

export function InstitutionNavigationCard({
  icon: Icon,
  title,
  description,
  onClick,
}: InstitutionNavigationCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full cursor-pointer flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition-colors hover:border-slate-400 hover:bg-slate-50"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-main">
          <Icon size={24} className="text-white" />
        </div>

        <FiArrowUpRight
          size={20}
          className="text-slate-400 transition-colors group-hover:text-slate-900"
        />
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>

        <p className="text-sm text-slate-500">{description}</p>
      </div>
    </button>
  );
}
