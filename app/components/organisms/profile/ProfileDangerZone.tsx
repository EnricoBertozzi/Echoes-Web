import { useState } from "react";

import { Button } from "~/components/atoms/Button";
import { Alert } from "~/components/atoms/page/Alert";
import { Modal } from "~/components/atoms/modal/Modal";
import { ModalButton } from "~/components/atoms/modal/ModalButton";
import { ModalTitle } from "~/components/atoms/modal/ModalTitle";
import { SectionCard } from "~/components/molecules/SectionCard";
import { useDeleteAccount } from "~/hooks/profile/useDeleteAccount";

export function ProfileDangerZone() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { deleting, error, resetError, handleDeleteAccount } =
    useDeleteAccount();

  function closeModal() {
    if (deleting) return;

    setIsModalOpen(false);
    resetError();
  }

  return (
    <>
      <SectionCard
        title="Zona de perigo"
        description="Ações permanentes sobre a sua conta."
        className="border border-red-200"
      >
        <p className="text-sm leading-relaxed text-slate-600">
          Ao excluir sua conta, seus dados pessoais são anonimizados e seus
          vínculos com turmas são removidos. Esta ação não pode ser desfeita.
        </p>

        <div className="w-full sm:w-64">
          <Button
            type="button"
            label="Excluir minha conta"
            variant="danger"
            onClick={() => setIsModalOpen(true)}
          />
        </div>
      </SectionCard>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalTitle
          title="Excluir conta"
          description="Tem certeza de que deseja excluir sua conta?"
        />

        <div className="flex flex-col gap-5">
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-relaxed text-red-700">
            Sua conta será desativada e seus dados pessoais serão anonimizados.
            Esta ação é permanente.
          </div>

          {error && <Alert message={error} type="error" />}

          <div className="flex justify-end gap-3">
            <ModalButton
              label="Cancelar"
              onAction={closeModal}
              disabled={deleting}
            />

            <ModalButton
              label={deleting ? "Excluindo..." : "Excluir conta"}
              variant="danger"
              onAction={handleDeleteAccount}
              disabled={deleting}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
