import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "~/components/atoms/Button";
import { Alert } from "~/components/atoms/page/Alert";
import { TableHeadColumn } from "~/components/atoms/TableHeadColumn";
import { TermAdminRow } from "~/components/organisms/terms/TermAdminRow";
import { TermContentModal } from "~/components/organisms/terms/TermContentModal";
import { TermCreateModal } from "~/components/organisms/terms/TermCreateModal";
import { TermStatusModal } from "~/components/organisms/terms/TermStatusModal";
import { TermViewModal } from "~/components/organisms/TermViewModal";
import { SelectField } from "~/components/molecules/input/SelectField";
import { useTermAdmin } from "~/hooks/terms/useTermAdmin";
import type {
  CreateTermRequest,
  TermResponseDTO,
  TermStatus,
} from "~/types/terms";
import {
  termStatusLabels,
  termStatuses,
  termTypeLabels,
  termTypes,
} from "~/types/terms";

const ALL = "all";

const typeOptions = new Map<string, string>([
  [ALL, "Todos os tipos"],
  ...termTypes.map((type): [string, string] => [type, termTypeLabels[type]]),
]);

const statusOptions = new Map<string, string>([
  [ALL, "Todos os status"],
  ...termStatuses.map((status): [string, string] => [
    status,
    termStatusLabels[status],
  ]),
]);

/**
 * Painel de administração exibido dentro da própria tela de Termos para
 * usuários ADMIN: histórico, filtros, criação, edição e alteração de status.
 */
export function TermsAdminPanel() {
  const {
    terms,
    publishedByType,
    loading,
    error,
    acting,
    refetch,
    createTerm,
    updateTermContent,
    changeTermStatus,
  } = useTermAdmin();

  const [typeFilter, setTypeFilter] = useState<string>(ALL);
  const [statusFilter, setStatusFilter] = useState<string>(ALL);

  const [createOpen, setCreateOpen] = useState(false);
  const [viewTerm, setViewTerm] = useState<TermResponseDTO | null>(null);
  const [contentTerm, setContentTerm] = useState<TermResponseDTO | null>(null);
  const [statusTerm, setStatusTerm] = useState<TermResponseDTO | null>(null);

  const filteredTerms = useMemo(
    () =>
      terms.filter(
        (term) =>
          (typeFilter === ALL || term.type === typeFilter) &&
          (statusFilter === ALL || term.status === statusFilter),
      ),
    [terms, typeFilter, statusFilter],
  );

  async function handleCreate(data: CreateTermRequest) {
    const created = await createTerm(data);

    if (!created) {
      return false;
    }

    toast.success(
      `${termTypeLabels[created.type]} versão ${created.version} criado`,
      { position: "bottom-right" },
    );

    return true;
  }

  async function handleSaveContent(content: string) {
    if (!contentTerm) {
      return false;
    }

    const updated = await updateTermContent(contentTerm.id, content);

    if (!updated) {
      return false;
    }

    toast.success("Conteúdo atualizado", { position: "bottom-right" });

    return true;
  }

  async function handleChangeStatus(status: TermStatus) {
    if (!statusTerm) {
      return false;
    }

    const updated = await changeTermStatus(statusTerm.id, status);

    if (!updated) {
      return false;
    }

    toast.success(
      `Status alterado para ${termStatusLabels[updated.status]}`,
      { position: "bottom-right" },
    );

    return true;
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
          <div className="w-full sm:w-60">
            <SelectField
              id="term-type-filter"
              name="type"
              label="Tipo"
              placeholder="Todos os tipos"
              options={typeOptions}
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              onBlur={() => undefined}
            />
          </div>

          <div className="w-full sm:w-60">
            <SelectField
              id="term-status-filter"
              name="status"
              label="Status"
              placeholder="Todos os status"
              options={statusOptions}
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              onBlur={() => undefined}
            />
          </div>
        </div>

        <div className="w-full sm:w-44">
          <Button label="Novo termo" onClick={() => setCreateOpen(true)} />
        </div>
      </div>

      {loading ? (
        <p className="flex h-40 items-center justify-center rounded-xl bg-stone-300 text-xl text-stone-500">
          Carregando termos...
        </p>
      ) : error ? (
        <div className="flex flex-col gap-3">
          <Alert message={error} type="error" />
          <div className="w-full sm:w-40">
            <Button label="Tentar novamente" variant="muted" onClick={refetch} />
          </div>
        </div>
      ) : filteredTerms.length === 0 ? (
        <Alert
          message="Nenhum termo encontrado com os filtros atuais."
          type="muted"
        />
      ) : (
        <div className="min-w-0">
          <ul className="grid gap-4 lg:hidden">
            {filteredTerms.map((term) => (
              <TermAdminRow
                key={term.id}
                term={term}
                mobile
                onView={setViewTerm}
                onEdit={setContentTerm}
                onChangeStatus={setStatusTerm}
              />
            ))}
          </ul>

          <table className="hidden w-full table-fixed lg:table">
            <thead className="bg-main text-white">
              <tr>
                <TableHeadColumn className="w-[26%] rounded-tl-md">
                  Tipo
                </TableHeadColumn>
                <TableHeadColumn className="w-[12%]">Versão</TableHeadColumn>
                <TableHeadColumn className="w-[16%]">Status</TableHeadColumn>
                <TableHeadColumn className="w-[22%]">
                  Atualizado em
                </TableHeadColumn>
                <TableHeadColumn className="w-[24%] rounded-tr-md">
                  Ações
                </TableHeadColumn>
              </tr>
            </thead>

            <tbody>
              {filteredTerms.map((term) => (
                <TermAdminRow
                  key={term.id}
                  term={term}
                  onView={setViewTerm}
                  onEdit={setContentTerm}
                  onChangeStatus={setStatusTerm}
                />
              ))}
            </tbody>
          </table>

          <p className="mt-3 text-sm text-slate-500">
            {filteredTerms.length} termo(s)
          </p>
        </div>
      )}

      <TermCreateModal
        isOpen={createOpen}
        busy={acting}
        publishedByType={publishedByType}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
      />

      <TermContentModal
        isOpen={contentTerm !== null}
        term={contentTerm}
        busy={acting}
        onClose={() => setContentTerm(null)}
        onSave={handleSaveContent}
      />

      <TermStatusModal
        isOpen={statusTerm !== null}
        term={statusTerm}
        busy={acting}
        publishedByType={publishedByType}
        onClose={() => setStatusTerm(null)}
        onChangeStatus={handleChangeStatus}
      />

      {viewTerm && (
        <TermViewModal
          term={viewTerm}
          isOpen
          onClose={() => setViewTerm(null)}
        />
      )}
    </>
  );
}
