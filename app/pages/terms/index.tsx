import { useState } from "react";

import { Main } from "~/components/atoms/page/Main";
import { PageTitle } from "~/components/atoms/PageTitle";
import { TableHeadColumn } from "~/components/atoms/TableHeadColumn";
import { TermTableRow } from "~/components/organisms/TermTableRow";
import { TermViewModal } from "~/components/organisms/TermViewModal";
import { TermsAdminPanel } from "~/components/organisms/terms/TermsAdminPanel";
import { useAuth } from "~/context/AuthContext";
import { useTerms } from "~/hooks/terms/useTerms";
import type { TermResponseDTO } from "~/types/terms";

export default function Terms() {
  const { user } = useAuth();

  if (user?.role === "ADMIN") {
    return (
      <Main>
        <PageTitle
          title="Termos"
          description="Crie versões, edite rascunhos e publique termos. Versões publicadas são imutáveis."
        />

        <TermsAdminPanel />
      </Main>
    );
  }

  return <PublishedTerms />;
}

/**
 * Visão somente-leitura dos termos publicados, exibida para os demais perfis.
 */
function PublishedTerms() {
  const { terms, loading, error, refetch } = useTerms();
  const [selectedTerm, setSelectedTerm] = useState<TermResponseDTO | null>(null);

  return (
    <Main>
      <PageTitle
        title={"Termos"}
        description={
          "Consulte os termos relacionados a Lei Geral de Proteção de Dados"
        }
      />

      <div className='mt-4 w-full min-w-0 max-w-5xl'>
        {/* Aviso quando alguns termos falharam, mas outros carregaram */}
        {error && terms.length > 0 && (
          <div className='mb-4 flex flex-col gap-3 rounded border border-amber-300 px-4 py-3 sm:flex-row sm:items-center sm:justify-between'>
            <span className='text-sm text-amber-800'>
              Alguns termos não puderam ser carregados: {error}
            </span>
            <button
              onClick={refetch}
              className='min-h-11 shrink-0 cursor-pointer rounded bg-amber-600 px-3 py-1 text-sm text-white'
            >
              Tentar novamente
            </button>
          </div>
        )}

        {loading ? (
          <p role="status" className="p-4 text-center text-black">
            Carregando termos...
          </p>
        ) : terms.length === 0 && error ? (
          <div className="flex flex-col items-center gap-2 p-4 text-center">
            <span className="text-sm text-red-500">{error}</span>
            <button
              type="button"
              onClick={refetch}
              className="min-h-11 cursor-pointer rounded bg-main px-4 py-1.5 text-sm text-white"
            >
              Tentar novamente
            </button>
          </div>
        ) : terms.length === 0 ? (
          <p className="p-4 text-center text-black">
            Nenhum termo publicado encontrado
          </p>
        ) : (
          <>
            <ul className="grid gap-4 lg:hidden">
              {terms.map((term) => (
                <TermTableRow key={term.type} term={term} mobile onView={setSelectedTerm} />
              ))}
            </ul>

            <div className="hidden max-h-96 overflow-y-auto rounded-md border border-main/50 lg:block">
              <table className="w-full table-fixed">
                <thead className="sticky top-0 bg-main text-white">
                  <tr>
                    <TableHeadColumn className="w-1/3">Termo</TableHeadColumn>
                    <TableHeadColumn className="w-1/6">Versão</TableHeadColumn>
                    <TableHeadColumn className="w-1/6">Status</TableHeadColumn>
                    <TableHeadColumn className="w-1/4">Atualizado em</TableHeadColumn>
                    <TableHeadColumn className="w-1/12 px-2">Ações</TableHeadColumn>
                  </tr>
                </thead>
                <tbody>
                  {terms.map((term) => (
                    <TermTableRow key={term.type} term={term} onView={setSelectedTerm} />
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        <p className='mt-3 text-sm text-slate-500'>
          {terms.length} termo(s) publicado(s)
        </p>
      </div>

      {selectedTerm && (
        <TermViewModal
          term={selectedTerm}
          onClose={() => setSelectedTerm(null)}
          isOpen={selectedTerm != null}
        />
      )}
    </Main>
  );
}
