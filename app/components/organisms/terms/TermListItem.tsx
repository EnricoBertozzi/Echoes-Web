import type { ReactNode } from "react";
import { TermStatusBadge } from "~/components/atoms/terms/TermStatusBadge";
import { formatTermTimestamp, termTypeLabels, type TermResponseDTO } from "~/types/terms";

interface TermListItemProps {
  term: TermResponseDTO;
  children: ReactNode;
}

export function TermListItem({ term, children }: TermListItemProps) {
  return (
    <li className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 text-slate-900 shadow-sm wrap-anywhere">
      <h2 className="font-semibold">{termTypeLabels[term.type]}</h2>
      <dl className="grid gap-3 text-sm sm:grid-cols-3">
        <div>
          <dt className="font-medium text-slate-700">Versão</dt>
          <dd>{term.version}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-700">Status</dt>
          <dd><TermStatusBadge status={term.status} /></dd>
        </div>
        <div>
          <dt className="font-medium text-slate-700">Atualizado em</dt>
          <dd>{formatTermTimestamp(term.timestamp)}</dd>
        </div>
      </dl>
      {children}
    </li>
  );
}
