import type { IconType } from "react-icons";

interface InstitutionInfoItemProps {
  icon: IconType;
  label: string;
  value: string;
}

export function InstitutionInfoItem({
  icon: Icon,
  label,
  value,
}: InstitutionInfoItemProps) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-100">
        <Icon size={20} className="text-slate-600" />
      </div>

      <div className="flex min-w-0 flex-col gap-1">
        <dt className="text-sm text-slate-500">{label}</dt>

        <dd className="break-words font-medium text-slate-900">{value}</dd>
      </div>
    </div>
  );
}
