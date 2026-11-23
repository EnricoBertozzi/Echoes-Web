
import { Modal } from "~/components/atoms/modal/Modal";
import { ModalText } from "~/components/atoms/modal/ModalText";
import { ModalTitle } from "~/components/atoms/modal/ModalTitle";

import type { AuditLog } from "~/types/audit";

import { formatAuditTimestamp } from "~/types/audit";

import {
  actionLabels,
  auditInstitutionLabel,
  describeAuditLog,
  entityLabels,
  roleLabels,
  statusLabels,
} from "~/utils/auditLabels";

export interface AuditDetailsModalProps {
  log: AuditLog | null;
  isAdmin: boolean;
  onClose: () => void;
}

function prettyDetails(details: string | null): string {
  if (!details) {
    return "Nenhum detalhe adicional registrado.";
  }

  try {
    const parsed: unknown = JSON.parse(details);

    return JSON.stringify(parsed, null, 2) ?? details;
  } catch {
    return details;
  }
}

export function AuditDetailsModal({
  log,
  isAdmin,
  onClose,
}: AuditDetailsModalProps) {
  if (!log) {
    return null;
  }

  const entityLabel =
    entityLabels[log.entity]?.label ?? log.entity;

  const metadata: Array<[string, string]> = [
    ["ID do log", log.id],
    ["Data/Hora", formatAuditTimestamp(log.timestamp)],
    ["Evento", describeAuditLog(log)],
    [
      "Entidade",
      log.entityName
        ? `${entityLabel} (${log.entity}) — ${log.entityName}`
        : `${entityLabel} (${log.entity})`,
    ],
    [
      "Ação",
      `${actionLabels[log.action] ?? log.action} (${log.action})`,
    ],
    [
      "Resultado",
      statusLabels[log.status] ?? log.status,
    ],
  ];

  if (log.actorName) {
    metadata.push(["Autor", log.actorName]);
  }

  if (log.actorRole) {
    metadata.push([
      "Papel",
      roleLabels[log.actorRole] ?? log.actorRole,
    ]);
  }

  if (log.actorInstitutionName) {
    metadata.push(["Instituição do autor", log.actorInstitutionName]);
  }

  metadata.push(["Autor (ID)", log.userId ?? "—"]);

  if (log.ip !== null) {
    metadata.push(["Endereço IP", log.ip]);
  }

  if (isAdmin) {
    metadata.push(["Instituição", auditInstitutionLabel(log)]);
  }

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      className="w-[52rem] max-h-[90vh] max-w-[94vw] overflow-y-auto"
    >
      <ModalTitle
        title="Detalhes da auditoria"
        description="Informações registradas pelo backend sobre a operação selecionada."
      />

      <dl className="grid gap-4 text-sm sm:grid-cols-2">
        {metadata.map(([label, value]) => (
          <div
            key={label}
            className="min-w-0 rounded-lg bg-zinc-50 p-3"
          >
            <dt className="mb-1 font-semibold text-slate-600">
              {label}
            </dt>

            <dd
              className={`break-words text-slate-900 ${
                label === "Autor (ID)" ? "font-mono text-xs" : ""
              }`}
            >
              {value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 rounded-lg bg-zinc-50 p-3 text-sm">
        <dt className="mb-1 font-semibold text-slate-600">
          Registro afetado (UUID)
        </dt>

        <dd className="break-all font-mono text-xs text-slate-900">
          {log.entityId ?? "—"}
        </dd>
      </div>

      <section className="mt-6">
        <h3 className="mb-2 text-lg font-semibold text-slate-900">
          Detalhes / mensagem de erro
        </h3>

        <ModalText
          text={
            log.status === "FAILED"
              ? "Falha registrada durante a operação."
              : "Informações adicionais da operação."
          }
          className="mb-2 text-sm"
        />

        <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-slate-200 bg-zinc-50 p-4 font-mono text-xs text-slate-800">
          {prettyDetails(log.details)}
        </pre>
      </section>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer rounded-lg bg-main px-6 py-2 font-medium text-white transition-colors hover:bg-main/80"
        >
          Fechar
        </button>
      </div>
    </Modal>
  );
}
