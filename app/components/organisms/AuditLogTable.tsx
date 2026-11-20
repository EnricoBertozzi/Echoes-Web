
import { FiEye } from "react-icons/fi";

import { TableHeadColumn } from "~/components/atoms/TableHeadColumn";

import type { AuditLog } from "~/types/audit";

import { formatAuditTimestamp } from "~/types/audit";

import {
  actionLabels,
  describeAuditLog,
  entityLabels,
  roleLabels,
  statusLabels,
  statusStyles,
} from "~/utils/auditLabels";

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
  const showIp = logs.some((log) => log.ip !== null);

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full min-w-[1000px] text-left text-sm text-slate-900">
        <thead className="bg-main text-white">
          <tr>
            <TableHeadColumn>Data/Hora</TableHeadColumn>
            <TableHeadColumn>Evento</TableHeadColumn>
            <TableHeadColumn>Resultado</TableHeadColumn>

            {isAdmin && (
              <TableHeadColumn>Instituição</TableHeadColumn>
            )}

            <TableHeadColumn>Autor</TableHeadColumn>

            {showIp && <TableHeadColumn>IP</TableHeadColumn>}

            <TableHeadColumn>Ações</TableHeadColumn>
          </tr>
        </thead>

        <tbody>
          {logs.map((log) => {
            const failed = log.status === "FAILED";

            return (
              <tr
                key={log.id}
                className={`border-t border-slate-200 align-top transition-colors hover:bg-zinc-50 ${
                  failed ? "bg-red-50/50" : ""
                }`}
              >
                <td className="whitespace-nowrap px-4 py-3">
                  {formatAuditTimestamp(log.timestamp)}
                </td>

                <td className="px-4 py-3">
                  <span className="block font-medium text-slate-900">
                    {describeAuditLog(log)}
                  </span>

                  <span className="mt-1 block text-xs text-slate-500">
                    {actionLabels[log.action] ?? log.action}
                    {" · "}
                    {entityLabels[log.entity]?.label ?? log.entity}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                      statusStyles[log.status] ??
                      "text-slate-700 bg-slate-100"
                    }`}
                  >
                    {statusLabels[log.status] ?? log.status}
                  </span>
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

                <td className="max-w-44 break-words px-4 py-3">
                  {log.actorName ? (
                    <>
                      <span className="block font-medium text-slate-900">
                        {log.actorName}
                      </span>

                      <span className="mt-1 block text-xs text-slate-500">
                        {log.actorRole
                          ? roleLabels[log.actorRole] ?? log.actorRole
                          : null}
                        {log.actorInstitutionName
                          ? ` · ${log.actorInstitutionName}`
                          : null}
                      </span>
                    </>
                  ) : (
                    <span
                      className="block break-all font-mono text-xs"
                      title={log.userId ?? undefined}
                    >
                      {display(log.userId)}
                    </span>
                  )}
                </td>

                {showIp && (
                  <td className="whitespace-nowrap px-4 py-3">
                    {display(log.ip)}
                  </td>
                )}

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
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
