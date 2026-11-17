import { useEffect, useState } from "react";

import { Button } from "~/components/atoms/Button";
import { Label } from "~/components/atoms/input/Label";
import { SelectInput } from "~/components/atoms/input/SelectInput";
import { Modal } from "~/components/atoms/modal/Modal";
import { ModalTitle } from "~/components/atoms/modal/ModalTitle";
import { Alert } from "~/components/atoms/page/Alert";
import type { TermResponseDTO, TermStatus, TermType } from "~/types/terms";
import {
  canPublishTermVersion,
  termStatusLabels,
  termStatuses,
  termTypeLabels,
} from "~/types/terms";

const statusOptions = new Map<string, string>(
  termStatuses.map((status) => [status, termStatusLabels[status]]),
);

export interface TermStatusModalProps {
  isOpen: boolean;
  term: TermResponseDTO | null;
  busy: boolean;
  publishedByType: Map<TermType, TermResponseDTO>;
  onClose: () => void;
  onChangeStatus: (status: TermStatus) => Promise<boolean>;
}

/**
 * Alteração de status com as regras do backend reproduzidas no cliente:
 * o PUBLISHED atual não pode mudar de status e, para publicar, a versão
 * precisa ser maior que a publicada atual do mesmo tipo.
 */
export function TermStatusModal({
  isOpen,
  term,
  busy,
  publishedByType,
  onClose,
  onChangeStatus,
}: TermStatusModalProps) {
  const [status, setStatus] = useState<TermStatus>("DRAFT");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && term) {
      setStatus(term.status);
      setError(null);
    }
  }, [isOpen, term]);

  if (!term) {
    return null;
  }

  const currentPublished = publishedByType.get(term.type);
  const willPublish = status === "PUBLISHED";
  const isRequiredType = term.type !== "PROCESSING_OPERATIONS";

  const versionIsGreater =
    currentPublished?.id === term.id ||
    canPublishTermVersion(term.version, currentPublished?.version);

  async function submit() {
    if (!term) {
      return;
    }

    if (willPublish && !versionIsGreater) {
      setError(
        `A versão ${term.version} precisa ser maior que a publicada atual${currentPublished ? ` (${currentPublished.version})` : ""}.`,
      );
      return;
    }

    if (await onChangeStatus(status)) {
      onClose();
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (!busy) onClose();
      }}
      className="w-[min(94vw,34rem)]"
    >
      <ModalTitle
        title="Alterar status"
        description={`${termTypeLabels[term.type]} · versão ${term.version}`}
      />

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Label id="term-new-status" name="status" label="Novo status" />
          <SelectInput
            id="term-new-status"
            name="status"
            placeholder="Selecione o status"
            options={statusOptions}
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as TermStatus);
              setError(null);
            }}
          />
        </div>

        {term.status === "PUBLISHED" && (
          <Alert
            type="error"
            message="O termo publicado atual não pode mudar de status. Publique outra versão do mesmo tipo para substituí-lo."
          />
        )}

        {willPublish && !versionIsGreater && (
          <Alert
            type="error"
            message={`A versão ${term.version} não é maior que a publicada atual${currentPublished ? ` (${currentPublished.version})` : ""}. O PATCH de status não valida isso; ajuste a versão antes de publicar.`}
          />
        )}

        {willPublish && versionIsGreater && (
          <Alert
            type="muted"
            message={
              isRequiredType
                ? "Ao publicar, a versão anterior deste tipo será arquivada e todos os usuários precisarão aceitar a nova versão."
                : "Ao publicar, a versão anterior deste tipo será arquivada. Este tipo não entra no aceite obrigatório."
            }
          />
        )}

        {error && <Alert type="error" message={error} />}

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            label="Cancelar"
            variant="muted"
            disabled={busy}
            onClick={onClose}
          />
          <Button
            type="button"
            label={busy ? "Salvando..." : "Alterar status"}
            disabled={
              busy ||
              status === term.status ||
              term.status === "PUBLISHED" ||
              (willPublish && !versionIsGreater)
            }
            onClick={() => void submit()}
          />
        </div>
      </div>
    </Modal>
  );
}
