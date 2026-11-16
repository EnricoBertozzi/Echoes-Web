
import { Modal } from "~/components/atoms/modal/Modal";
import { ModalText } from "~/components/atoms/modal/ModalText";
import { ModalTitle } from "~/components/atoms/modal/ModalTitle";

import type { AuditLog } from "~/types/audit";

import {
  AUDIT_STATUS_LABELS,
  auditActionLabel,
  auditEntityLabel,
  formatAuditTimestamp,
} from "~/types/audit";

export interface AuditDetailsModalProps {
  log: AuditLog | null;
  isAdmin: boolean;
  institutionName: string | null;
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
  institutionName,
  onClose,
}: AuditDetailsModalProps) {
  if (!log) {
    return null;
  }

  const metadata: Array<[string, string]> = [
    ["ID do log", log.id],
    ["Data/Hora", formatAuditTimestamp(log.timestamp)],
    [
      "Entidade",
      `${auditEntityLabel(log.entity)} (${log.entity})`,
    ],
    [
      "Ação",
      `${auditActionLabel(log.action)} (${log.action})`,
    ],
    ["Resultado", AUDIT_STATUS_LABELS[log.status]],
    ["Registro afetado", log.entityId ?? "—"],
    ["Autor (ID)", log.userId ?? "—"],
    ["Endereço IP", log.ip ?? "—"],
  ];

  if (isAdmin) {
    metadata.push([
      "Instituição",
      log.institutionId
        ? institutionName ?? log.institutionId
        : "Evento global",
    ]);
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

            <dd className="break-all text-slate-900">
              {value}
            </dd>
          </div>
        ))}
      </dl>

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

        <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-all rounded-lg border border-slate-200 bg-zinc-50 p-4 font-mono text-xs text-slate-800">
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

