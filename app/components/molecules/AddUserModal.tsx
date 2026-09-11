import { Dialog } from "radix-ui";
import { FiPlus } from "react-icons/fi";
import { TextInput } from "../atoms/TextInput";

export function AddUserModal() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className='cursor-pointer'>
          <FiPlus
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
            Cadastrar usuário
          </Dialog.Title>

          <Dialog.Description className="mt-1 text-sm text-gray-500">
            Digite os dados do novo usuário
          </Dialog.Description>

          <div className="mt-6 flex flex-col gap-2">
            <p>Nome</p>
            <TextInput
              placeholder='Digite o nome'
            />
          </div>
          <div className="mt-6 flex flex-col gap-2">
            <p>E-mail</p>
            <TextInput
              placeholder='Digite o e-email'
            />
          </div>

          <div className='mt-6 flex flex-col gap-2'>
            <p>Cargo</p>
            <div className='flex flex-row flex-wrap gap-4'>
            <label>
            <input
            type='radio'
            name='role'
            />
            <span>Administrador</span>
            </label>
            <label>
            <input
            type='radio'
            name='role'
            />
            <span>Gestor</span>
            </label>
            <label>
            <input
            type='radio'
            name='role'
            />
            <span>Professor</span>
            </label>
            <label>
            <input
            type='radio'
            name='role'
            />
            <span>Estudante</span>
            </label>
            </div>
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
