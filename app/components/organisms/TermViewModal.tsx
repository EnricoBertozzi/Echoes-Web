import { Markdown } from "../atoms/Markdown";
import { Modal } from "../atoms/modal/Modal";
import { ModalTitle } from "../atoms/modal/ModalTitle";
import type { TermResponseDTO } from "~/types/terms";
import { formatTermTimestamp, termStatusLabels, termTypeLabels } from "~/types/terms";

export interface TermViewModalProps {
  isOpen: boolean
  term: TermResponseDTO;
  onClose: () => void;
}

export function TermViewModal({ term, isOpen, onClose }: TermViewModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="w-[52rem] max-w-[92vw] max-lg:max-h-[calc(100dvh_-_2rem)] max-lg:overflow-y-auto max-lg:overscroll-contain max-lg:wrap-anywhere"
    >
      <ModalTitle
        title={termTypeLabels[term.type]}
        description={`Versão ${term.version} · ${termStatusLabels[term.status]} · Atualizado em ${formatTermTimestamp(term.timestamp)}`}
      />

      <div className='rounded border border-zinc-200 bg-zinc-50 px-3 py-4 sm:px-6 lg:max-h-[60vh] lg:overflow-y-auto'>
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
