import type { InstitutionDevices } from "~/types/dashboard";
import { formatNumber } from "~/utils/dashboardFormat";

export interface DeviceStatusChartProps {
  institutions: InstitutionDevices[];
}

/**
 * Uma barra por instituição: operando, ACTIVE bloqueado pela instituição e
 * INACTIVE. (PENDING não tem instituição, aparece só no resumo.)
 */
export function DeviceStatusChart({ institutions }: DeviceStatusChartProps) {
  if (institutions.length === 0) {
    return (
      <p className="text-slate-500">Nenhum dispositivo associado a instituições.</p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col gap-4">
        {institutions.map((row) => {
          const blocked = row.active - row.operating;
          const total = Math.max(1, row.active + row.inactive);

          return (
            <li key={row.institutionId} className="flex flex-col gap-1">
              <div className="flex items-baseline justify-between gap-4">
                <span className="line-clamp-1 font-semibold text-slate-900">
                  {row.institutionName}
                </span>
                <span className="shrink-0 text-sm tabular-nums text-slate-500">
                  {formatNumber(row.active + row.inactive)}
                </span>
              </div>

              <div
                className="flex h-3 overflow-hidden rounded-full bg-slate-100"
                role="img"
                aria-label={`${row.operating} operando, ${blocked} bloqueados pela instituição, ${row.inactive} inativos`}
              >
                <span
                  className="bg-main"
                  style={{ width: `${(row.operating / total) * 100}%` }}
                />
                <span
                  className="bg-amber-500"
                  style={{ width: `${(blocked / total) * 100}%` }}
                />
                <span
                  className="bg-red-400"
                  style={{ width: `${(row.inactive / total) * 100}%` }}
                />
              </div>

              {!row.institutionActive && (
                <span className="text-sm text-amber-700">
                  Instituição inativa ou removida: dispositivos bloqueados.
                </span>
              )}
            </li>
          );
        })}
      </ul>

      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
        <li><i className="mr-1 inline-block size-2.5 rounded-sm bg-main" />Operando</li>
        <li><i className="mr-1 inline-block size-2.5 rounded-sm bg-amber-500" />Bloqueado pela instituição</li>
        <li><i className="mr-1 inline-block size-2.5 rounded-sm bg-red-400" />Inativo</li>
      </ul>
    </div>
  );
}
