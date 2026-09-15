import { useEffect, useState } from "react";
import { Dialog } from "radix-ui";
import { FiEdit2 } from "react-icons/fi";
import type { User } from "~/types/user";
import { useUpdateUser } from "~/hooks/useUpdateUser";
import { TextInput } from "../atoms/TextInput";

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

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen) {
      form.reset();
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <button
          className='cursor-pointer'
          aria-label={`Editar usuário ${user.name}`}
        >
          <FiEdit2
            size={24}
            className='text-main hover:text-main/50 transition-all'
          />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />

        <Dialog.Content
          className="
            fixed
            top-1/2
            left-1/2
            w-[90%]
            max-w-md
            -translate-x-1/2
            -translate-y-1/2
            rounded-lg
            bg-zinc-200
            p-6
            shadow-xl
            text-black
          "
        >
          <Dialog.Title className="text-lg font-semibold">
            Editar usuário
          </Dialog.Title>

          <Dialog.Description className="mt-1 text-sm text-gray-500">
            Altere os dados do usuário.
          </Dialog.Description>

          <form className='flex flex-col' onSubmit={form.handleSubmit}>
            <div className="mt-6 flex flex-col gap-2">
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
              <p className="mt-4 text-sm text-red-500">{form.generalError}</p>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <Dialog.Close asChild>
                <button
                  type='button'
                  className="text-red-500 rounded px-4 py-2 cursor-pointer"
                >
                  Cancelar
                </button>
              </Dialog.Close>

              <button
                type='submit'
                className="rounded bg-main px-4 py-2 text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                disabled={form.submitting}
              >
                {form.submitting ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
