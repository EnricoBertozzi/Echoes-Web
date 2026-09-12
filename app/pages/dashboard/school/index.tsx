import { useState } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import { Button } from "~/components/atoms/Button";
import { TableHeadColumn } from "~/components/atoms/TableHeadColumn";
import { AddInstitutionModal } from "~/components/molecules/AddInstitutionModal";
import { EditInstitutionModal } from "~/components/molecules/EditInstitutionModal";
import { InstitutionTableRow } from "~/components/molecules/InstitutionTableRow";
import { Navbar } from "~/components/molecules/Navbar";
import { useDeleteInstitution } from "~/hooks/useDeleteInstitution";
import { useInstitutions } from "~/hooks/useInstitutions";
import { useToggleInstitutionStatus } from "~/hooks/useToggleInstitutionStatus";
import type { Institution } from "~/types/Institution";
import type { Route } from "./+types/index";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Instituições — Echoes" }];
}

export default function SchoolPage() {
  const { page, loading, error, name, setName, pageNumber, setPageNumber, refetch } =
    useInstitutions();
  const { toggle, loading: toggling } = useToggleInstitutionStatus();
  const { remove } = useDeleteInstitution();

  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<Institution | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  async function handleToggleStatus(institution: Institution) {
    setTogglingId(institution.id);
    const ok = await toggle(institution.id);
    setTogglingId(null);
    if (ok) refetch();
  }

  async function handleDelete(institution: Institution) {
    const confirmed = window.confirm(
      `Excluir a instituição "${institution.name}"? Essa ação não pode ser desfeita.`,
    );
    if (!confirmed) return;
    const ok = await remove(institution.id);
    if (ok) refetch();
  }

  return (
    <div>
      <Navbar title="Instituições" />

      <div className="p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="relative max-w-sm flex-1">
            <FiSearch className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-zinc-400" />
            <input
              value={name}
              onChange={(e) => {
                setPageNumber(0);
                setName(e.target.value);
              }}
              placeholder="Buscar por nome"
              className="w-full rounded border border-zinc-400 bg-white py-2 pr-4 pl-9 text-black outline-none focus:border-main"
            />
          </div>
          <Button onClick={() => setAddOpen(true)} className="flex items-center gap-2">
            <FiPlus />
            Nova instituição
          </Button>
        </div>

        <div className="overflow-hidden rounded bg-white shadow-sm">
          <table className="w-full">
            <thead className="border-b border-zinc-200 bg-zinc-50">
              <tr>
                <TableHeadColumn>Nome</TableHeadColumn>
                <TableHeadColumn>Sigla</TableHeadColumn>
                <TableHeadColumn>CNPJ</TableHeadColumn>
                <TableHeadColumn>E-mail</TableHeadColumn>
                <TableHeadColumn>Telefone</TableHeadColumn>
                <TableHeadColumn>Status</TableHeadColumn>
                <TableHeadColumn align="right">Ações</TableHeadColumn>
              </tr>
            </thead>
            <tbody>
              {page?.content.map((institution) => (
                <InstitutionTableRow
                  key={institution.id}
                  institution={institution}
                  onEdit={setEditing}
                  onDelete={handleDelete}
                  onToggleStatus={handleToggleStatus}
                  toggling={toggling && togglingId === institution.id}
                />
              ))}
            </tbody>
          </table>

          {loading && (
            <p className="p-6 text-center text-sm text-zinc-500">Carregando...</p>
          )}
          {!loading && error && (
            <p className="p-6 text-center text-sm text-red-600">{error}</p>
          )}
          {!loading && !error && page?.empty && (
            <p className="p-6 text-center text-sm text-zinc-500">
              Nenhuma instituição encontrada.
            </p>
          )}
        </div>

        {page && page.totalPages > 1 && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <Button
              variant="secondary"
              disabled={page.first}
              onClick={() => setPageNumber(pageNumber - 1)}
            >
              Anterior
            </Button>
            <span className="text-sm text-zinc-600">
              Página {page.number + 1} de {page.totalPages}
            </span>
            <Button
              variant="secondary"
              disabled={page.last}
              onClick={() => setPageNumber(pageNumber + 1)}
            >
              Próxima
            </Button>
          </div>
        )}
      </div>

      <AddInstitutionModal
        open={addOpen}
        onOpenChange={setAddOpen}
        onCreated={refetch}
      />
      <EditInstitutionModal
        institution={editing}
        onOpenChange={(open) => !open && setEditing(null)}
        onUpdated={refetch}
      />
    </div>
  );
}
