import type { ReactNode } from "react";
import { FiEye } from "react-icons/fi";
import { TableHeadColumn } from "~/components/atoms/TableHeadColumn";
import { formatAuditTimestamp, type AuditLog } from "~/types/audit";
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

interface AuditColumn {
  label: string;
  cellClassName?: string;
  render: (log: AuditLog) => ReactNode;
}

function eventDetails(log: AuditLog) {
  return (
    <>
      <span className="block font-medium">{describeAuditLog(log)}</span>
      <span className="mt-1 block text-xs text-slate-500">
        {actionLabels[log.action] ?? log.action}
        {" · "}
        {entityLabels[log.entity]?.label ?? log.entity}
      </span>
    </>
  );
}

function auditResult(log: AuditLog) {
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
      statusStyles[log.status] ?? "bg-slate-100 text-slate-700"
    }`}>
      {statusLabels[log.status] ?? log.status}
    </span>
  );
}

function auditAuthor(log: AuditLog) {
  if (!log.actorName) {
    return (
      <span className="block break-all font-mono text-xs" title={log.userId ?? undefined}>
        {log.userId || "—"}
      </span>
    );
  }

  return (
    <>
      <span className="block font-medium">{log.actorName}</span>
      <span className="mt-1 block text-xs text-slate-500">
        {log.actorRole ? roleLabels[log.actorRole] ?? log.actorRole : null}
        {log.actorInstitutionName ? ` · ${log.actorInstitutionName}` : null}
      </span>
    </>
  );
}

export function AuditLogTable({
  logs,
  isAdmin,
  institutionNames,
  onView,
}: AuditLogTableProps) {
  const columns: AuditColumn[] = [
    {
      label: "Data/Hora",
      cellClassName: "whitespace-nowrap",
      render: (log) => formatAuditTimestamp(log.timestamp),
    },
    { label: "Evento", render: eventDetails },
    { label: "Resultado", render: auditResult },
  ];

  if (isAdmin) {
    columns.push({
      label: "Instituição",
      cellClassName: "max-w-52",
      render: (log) => log.institutionId
        ? institutionNames.get(log.institutionId) ?? log.institutionId
        : "Global",
    });
  }

  columns.push({ label: "Autor", cellClassName: "max-w-44", render: auditAuthor });

  if (logs.some((log) => log.ip !== null)) {
    columns.push({
      label: "IP",
      cellClassName: "whitespace-nowrap",
      render: (log) => log.ip || "—",
    });
  }

  function viewButton(log: AuditLog) {
    return (
      <button
        type="button"
        onClick={() => onView(log)}
        className="inline-flex min-h-11 items-center gap-2 rounded-lg p-2 text-main hover:bg-main/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main lg:min-h-0"
        aria-label={`Visualizar detalhes do log ${log.id}`}
        title="Visualizar detalhes"
      >
        <FiEye size={21} aria-hidden="true" />
        <span className="lg:hidden">Visualizar detalhes</span>
      </button>
    );
  }

  return (
    <>
      <ul className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 lg:hidden">
        {logs.map((log) => (
          <li
            key={log.id}
            className={`flex flex-col gap-3 p-3 text-sm text-slate-900 wrap-anywhere ${
              log.status === "FAILED" ? "bg-red-50/50" : ""
            }`}
          >
            <dl className="grid gap-3 sm:grid-cols-2">
              {columns.map(({ label, render }) => (
                <div key={label} className="min-w-0">
                  <dt className="font-semibold text-slate-700">{label}</dt>
                  <dd>{render(log)}</dd>
                </div>
              ))}
            </dl>
            <div>{viewButton(log)}</div>
          </li>
        ))}
      </ul>

      <div className="hidden w-full overflow-x-auto rounded-xl border border-slate-200 lg:block">
        <table className="w-full min-w-[1000px] text-left text-sm text-slate-900">
          <thead className="bg-main text-white">
            <tr>
              {columns.map(({ label }) => (
                <TableHeadColumn key={label}>{label}</TableHeadColumn>
              ))}
              <TableHeadColumn>Ações</TableHeadColumn>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr
                key={log.id}
                className={`border-t border-slate-200 align-top transition-colors hover:bg-zinc-50 ${
                  log.status === "FAILED" ? "bg-red-50/50" : ""
                }`}
              >
                {columns.map(({ label, cellClassName, render }) => (
                  <td key={label} className={`px-4 py-3 wrap-anywhere ${cellClassName ?? ""}`}>
                    {render(log)}
                  </td>
                ))}
                <td className="px-4 py-3 text-center">{viewButton(log)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
