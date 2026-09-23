import { useState } from "react";
import { TableHeadColumn } from "~/components/atoms/TableHeadColumn";
import { TermTableRow } from "~/components/organisms/TermTableRow";
import { TermViewModal } from "~/components/organisms/TermViewModal";
import { useTerms } from "~/hooks/useTerms";
import type { TermResponseDTO } from "~/types/terms";

export default function Terms() {
  const { terms, loading, error, refetch } = useTerms();
  const [selectedTerm, setSelectedTerm] = useState<TermResponseDTO | null>(null);

  return (
    <main className='flex flex-1 flex-col justify-center items-center'>
      <div className='w-full max-w-5xl flex flex-row justify-between items-center'>
        <h2 className='text-lg text-black font-medium'>Termos</h2>
      </div>

      <div className='w-full max-w-5xl mt-4'>
        {/* Aviso quando alguns termos falharam, mas outros carregaram */}
        {error && terms.length > 0 && (
          <div className='mb-4 flex flex-row justify-between items-center rounded border border-amber-300  px-4 py-3'>
            <span className='text-sm text-amber-800'>
              Alguns termos não puderam ser carregados: {error}
            </span>
            <button
              onClick={refetch}
              className='rounded bg-amber-600 px-3 py-1 text-white text-sm cursor-pointer'
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* Header */}
        <table className='w-full table-fixed'>
          <thead className='bg-main text-white'>
            <tr>
              <TableHeadColumn className='w-1/3 rounded-tl-md'>
                Termo
              </TableHeadColumn>

              <TableHeadColumn className='w-1/6'>
                Versão
              </TableHeadColumn>

              <TableHeadColumn className='w-1/6'>
                Status
              </TableHeadColumn>

              <TableHeadColumn className='w-1/4'>
                Atualizado em
              </TableHeadColumn>

              <TableHeadColumn className='w-1/12 rounded-tr-md'>
                Ações
              </TableHeadColumn>
            </tr>
          </thead>
        </table>

        {/* Body */}
        <div className='max-h-96 overflow-y-auto scrollbar-thin rounded-b-md border border-t-0 border-main/50'>
          {loading ? (
            <div className='flex justify-center items-center h-24 text-black'>
              Carregando termos...
            </div>
          ) : terms.length === 0 && error ? (
            <div className='flex flex-col justify-center items-center h-24 gap-2'>
              <span className='text-sm text-red-500'>{error}</span>
              <button
                onClick={refetch}
                className='rounded bg-main px-4 py-1.5 text-white text-sm cursor-pointer'
              >
                Tentar novamente
              </button>
            </div>
          ) : terms.length === 0 ? (
            <div className='flex justify-center items-center h-24 text-black'>
              Nenhum termo publicado encontrado
            </div>
          ) : (
            <table className='w-full table-fixed'>
              <tbody>
                {terms.map((term) => (
                  <TermTableRow
                    key={term.type}
                    term={term}
                    onView={setSelectedTerm}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>

        <p className='mt-3 text-sm text-slate-500'>
          {terms.length} termo(s) publicado(s)
        </p>
      </div>

      {selectedTerm && (
        <TermViewModal
          term={selectedTerm}
          onClose={() => setSelectedTerm(null)}
        />
      )}
    </main>
  );
}
