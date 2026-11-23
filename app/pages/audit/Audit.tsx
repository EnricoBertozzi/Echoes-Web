
import { useState } from "react";
import { Link } from "react-router";

import { Card } from "~/components/atoms/card/Card";
import { PageTitle } from "~/components/atoms/PageTitle";
import { Alert } from "~/components/atoms/page/Alert";
import { Main } from "~/components/atoms/page/Main";
import { PaginationSelector } from "~/components/atoms/page/PaginationSelector";

import { AuditFilters } from "~/components/molecules/AuditFilters";
import { AuditDetailsModal } from "~/components/organisms/AuditDetailsModal";
import { AuditLogTable } from "~/components/organisms/AuditLogTable";

import { useAuth } from "~/context/AuthContext";
import { useAuditLogs } from "~/hooks/audit/useAuditLogs";
import { useInstitutionOptions } from "~/hooks/dashboard/useInstitutionOptions";

import type { AuditLog } from "~/types/audit";

export default function Audit() {
  const { user } = useAuth();

  const isAdmin = user?.role === "ADMIN";

  const institutions = useInstitutionOptions(isAdmin);

  const [selectedLog, setSelectedLog] =
    useState<AuditLog | null>(null);

  const {
    logs,
    loading,
    error,
    totalElements,
    totalPages,
    page,
    size,

    institutionFilter,
    entityFilter,
    actionFilter,
    statusFilter,

    setPage,
    setSize,
    setInstitutionFilter,
    setEntityFilter,
    setActionFilter,
    setStatusFilter,
    refetch,
  } = useAuditLogs();

  return (
    <Main>
      <PageTitle
        title="Auditoria"
        description={
          isAdmin
            ? "Consulte eventos globais e operações registradas em todas as instituições."
            : "Consulte os eventos de auditoria vinculados à sua instituição."
        }
      />

      {isAdmin && (
        <Link to="/audit/restorations"
          className="w-fit rounded-md bg-main px-4 py-2 font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main">
          Restaurações
        </Link>
      )}

      <Card>
        <h2 className="text-xl font-semibold text-slate-900">
          Filtros
        </h2>

        <AuditFilters
          isAdmin={isAdmin}
          institutions={institutions}
          institutionFilter={institutionFilter}
          entityFilter={entityFilter}
          actionFilter={actionFilter}
          statusFilter={statusFilter}
          onInstitutionChange={setInstitutionFilter}
          onEntityChange={setEntityFilter}
          onActionChange={setActionFilter}
          onStatusChange={setStatusFilter}
        />
      </Card>

      <Card>
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Registros de auditoria
            </h2>

            <p className="text-sm text-slate-500">
              {totalElements.toLocaleString("pt-BR")}{" "}
              registro(s) encontrado(s)
            </p>
          </div>

          <button
            type="button"
            onClick={refetch}
            disabled={loading}
            className="min-h-11 w-full cursor-pointer rounded-lg bg-main px-4 py-2 text-sm font-medium text-white hover:bg-main/80 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            Atualizar
          </button>
        </header>

        {!loading && !error && totalPages > 0 && (
          <PaginationSelector
            label="Por página"
            page={page}
            totalPages={totalPages}
            size={size}
            sizeOptions={[10, 20, 50, 100]}
            prevPage={() => setPage(page - 1)}
            nextPage={() => setPage(page + 1)}
            onChange={(value) => setSize(Number(value))}
          />
        )}

        {error && (
          <Alert
            type="error"
            message={error}
          />
        )}

        {loading ? (
          <p
            role="status"
            className="flex min-h-40 items-center justify-center rounded-xl bg-zinc-100 text-lg text-slate-500"
          >
            Carregando registros de auditoria...
          </p>
        ) : error ? null : logs.length === 0 ? (
          <Alert
            type="muted"
            message="Nenhum registro encontrado para os filtros selecionados."
          />
        ) : (
          <AuditLogTable
            logs={logs}
            isAdmin={isAdmin}
            onView={setSelectedLog}
          />
        )}
      </Card>

      <AuditDetailsModal
        log={selectedLog}
        isAdmin={isAdmin}
        onClose={() => setSelectedLog(null)}
      />
    </Main>
  );
}

