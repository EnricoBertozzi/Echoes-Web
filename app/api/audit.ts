
import type { AuditFilters, AuditPage } from "~/types/audit";
import { api } from "./axios";

const BASE = "/api/v1/audit-logs";

/**
 * Consulta os registros de auditoria.
 *
 * A autorização e o escopo institucional efetivo
 * são aplicados obrigatoriamente pelo backend.
 */
export async function findAuditLogs(
  filters: AuditFilters,
): Promise<AuditPage> {
  const response = await api.get<AuditPage>(BASE, {
    params: {
      page: filters.page,
      size: filters.size,
      sort: "timestamp,desc",

      ...(filters.institutionId
        ? { institutionId: filters.institutionId }
        : {}),

      ...(filters.entity
        ? { entity: filters.entity }
        : {}),

      ...(filters.action
        ? { action: filters.action }
        : {}),

      ...(filters.status
        ? { status: filters.status }
        : {}),
    },
  });

  return response.data;
}

