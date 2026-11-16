
import { FiEye } from "react-icons/fi";

import { TableHeadColumn } from "~/components/atoms/TableHeadColumn";

import type { AuditLog } from "~/types/audit";

import {
  AUDIT_STATUS_LABELS,
  auditActionLabel,
  auditEntityLabel,
  formatAuditTimestamp,
} from "~/types/audit";

export interface AuditLogTableProps {
  logs: AuditLog[];
  isAdmin: boolean;
  institutionNames: ReadonlyMap<string, string>;
  onView: (log: AuditLog) => void;
}

function display(value: string | null): string {
  return value || "—";
}

export function AuditLogTable({
  logs,
  isAdmin,
  institutionNames,
  onView,
}: AuditLogTableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full min-w-[1050px] text-left text-sm text-slate-900">
        <thead className="bg-main text-white">
          <tr>
            <TableHeadColumn>Data/Hora</TableHeadColumn>
            <TableHeadColumn>Entidade</TableHeadColumn>
            <TableHeadColumn>Ação</TableHeadColumn>
            <TableHeadColumn>Resultado</TableHeadColumn>
            <TableHeadColumn>Registro afetado</TableHeadColumn>

            {isAdmin && (
              <TableHeadColumn>Instituição</TableHeadColumn>
            )}

            <TableHeadColumn>Autor</TableHeadColumn>
            <TableHeadColumn>IP</TableHeadColumn>
            <TableHeadColumn>Ações</TableHeadColumn>
          </tr>
        </thead>

        <tbody>
          {logs.map((log) => (
            <tr
              key={log.id}
              className="border-t border-slate-200 align-top transition-colors hover:bg-zinc-50"
            >
              <td className="whitespace-nowrap px-4 py-3">
                {formatAuditTimestamp(log.timestamp)}
              </td>

              <td className="px-4 py-3">
                {auditEntityLabel(log.entity)}
              </td>

              <td className="px-4 py-3">
                {auditActionLabel(log.action)}
              </td>

              <td className="px-4 py-3">
                <span
                  className={
                    log.status === "SUCCESS"
                      ? "inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800"
                      : "inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800"
                  }
                >
                  {AUDIT_STATUS_LABELS[log.status]}
                </span>
              </td>

              <td
                className="max-w-44 break-all px-4 py-3 font-mono text-xs"
                title={log.entityId ?? undefined}
              >
                {display(log.entityId)}
              </td>

              {isAdmin && (
                <td
                  className="max-w-52 break-words px-4 py-3"
                  title={log.institutionId ?? undefined}
                >
                  {log.institutionId
                    ? institutionNames.get(log.institutionId) ??
                      log.institutionId
                    : "Global"}
                </td>
              )}

              <td
                className="max-w-44 break-all px-4 py-3 font-mono text-xs"
                title={log.userId ?? undefined}
              >
                {display(log.userId)}
              </td>

              <td className="whitespace-nowrap px-4 py-3">
                {display(log.ip)}
              </td>

              <td className="px-4 py-3 text-center">
                <button
                  type="button"
                  onClick={() => onView(log)}
                  className="cursor-pointer rounded-lg p-2 text-main transition-colors hover:bg-main/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main"
                  aria-label={`Visualizar detalhes do log ${log.id}`}
                  title="Visualizar detalhes"
                >
                  <FiEye
                    size={21}
                    aria-hidden="true"
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

