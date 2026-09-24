import { Markdown } from "../atoms/Markdown";
import { Modal } from "../atoms/modal/Modal";
import { ModalTitle } from "../atoms/modal/ModalTitle";
import type { TermResponseDTO } from "~/types/terms";
import { formatTermTimestamp, termStatusLabels, termTypeLabels } from "~/types/terms";

export interface TermViewModalProps {
  term: TermResponseDTO;
  onClose: () => void;
}

export function TermViewModal({ term, onClose }: TermViewModalProps) {
  return (
    <Modal className='w-[52rem] max-w-[92vw]'>
      <ModalTitle
        title={termTypeLabels[term.type]}
        description={`Versão ${term.version} · ${termStatusLabels[term.status]} · Atualizado em ${formatTermTimestamp(term.timestamp)}`}
      />

      <div className='max-h-[60vh] overflow-y-auto rounded border border-zinc-200 bg-zinc-50 px-6 py-4'>
        <Markdown content={term.content} />
      </div>

      <div className='mt-6 flex justify-end'>
        <button
          type='button'
          onClick={onClose}
          className='cursor-pointer rounded bg-main px-6 py-2 text-white transition-all hover:bg-main/80'
        >
          Fechar
        </button>
      </div>
    </Modal>
  );
}
