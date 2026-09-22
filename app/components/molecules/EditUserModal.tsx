import { useEffect, useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import type { User } from "~/types/user";
import { useUpdateUser } from "~/hooks/useUpdateUser";
import { TextInput } from "../atoms/TextInput";
import { Modal } from "../atoms/modal/Modal";
import { ModalTitle } from "../atoms/modal/ModalTitle";
import { ModalForm } from "../atoms/modal/ModalForm";
import { ModalButton } from "../atoms/modal/ModalButton";

export interface EditUserModalProps {
  user: User;
  onUpdated?: () => void;
}

export function EditUserModal({ user, onUpdated }: EditUserModalProps) {
  const [open, setOpen] = useState(false);
  const form = useUpdateUser(user, onUpdated);

  useEffect(() => {
    if (form.succeeded) {
      setOpen(false);
    }
  }, [form.succeeded]);

  function handleOpen() {
    setOpen(true);
    form.reset();
  }

  return (
    <>
      <button
        className='cursor-pointer'
        aria-label={`Editar usuário ${user.name}`}
        onClick={handleOpen}
      >
        <FiEdit2
          size={24}
          className='text-main hover:text-main/50 transition-all'
        />
      </button>

      {open && (
        <Modal>
          <ModalTitle
            title='Editar usuário'
            description='Altere os dados do usuário.'
          />

          <ModalForm onSubmit={form.handleSubmit}>
            <div className="flex flex-col gap-2">
              <p>Nome</p>
              <TextInput
                placeholder='Digite o nome'
                aria-label='Nome'
                value={form.name}
                onChange={(event) => form.setName(event.target.value)}
              />
              {form.fieldErrors.name && (
                <span className="text-sm text-red-500">
                  {form.fieldErrors.name}
                </span>
              )}
            </div>

            {form.generalError && (
              <p className="text-sm text-red-500">{form.generalError}</p>
            )}

            <div className="flex justify-end gap-2">
              <ModalButton
                label='Cancelar'
                onAction={() => setOpen(false)}
                className='bg-stone-300'
              />

              <button
                type='submit'
                className="rounded bg-main px-4 py-2 text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                disabled={form.submitting}
              >
                {form.submitting ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </ModalForm>
        </Modal>
      )}
    </>
  );
}
