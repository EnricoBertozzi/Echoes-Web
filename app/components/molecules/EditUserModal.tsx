import { Dialog } from "radix-ui";
import { FiEdit2 } from "react-icons/fi";
import type { User } from "~/types/user";
import { TextInput } from "../atoms/TextInput";

export interface EditUserModalProps {
  user: User;
}

export function EditUserModal({ user }: EditUserModalProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className='cursor-pointer'>
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
          "
        >
          <Dialog.Title className="text-black text-lg font-semibold">
            Editar usuário
          </Dialog.Title>

          <Dialog.Description className="mt-1 text-sm text-gray-500">
            Altere os dados do usuário.
          </Dialog.Description>

          <div className="mt-6 text-black flex flex-col gap-2">
            <p>Nome</p>
            <TextInput
              placeholder={user.name}
            />
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Dialog.Close asChild>
              <button className="text-red-500 rounded px-4 py-2 cursor-pointer">
                Cancelar
              </button>
            </Dialog.Close>

            <button className="rounded bg-main px-4 py-2 text-white cursor-pointer">
              Salvar
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
