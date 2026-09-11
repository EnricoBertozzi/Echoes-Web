import { useState } from "react";
import { Dialog } from "radix-ui";
import { FiPlus } from "react-icons/fi";
import { userRoleLabels, userRoles } from "~/types/user";
import { useCreateUser } from "~/hooks/useCreateUser";
import { TextInput } from "../atoms/TextInput";

export interface AddUserModalProps {
  onCreated?: () => void;
}

export function AddUserModal({ onCreated }: AddUserModalProps) {
  const [open, setOpen] = useState(false);
  const form = useCreateUser(onCreated);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      form.reset();
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <button className='cursor-pointer' aria-label='Cadastrar usuário'>
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

          {form.success ? (
            <div className="mt-6 flex flex-col gap-4">
              <p className="text-sm">
                Convite enviado para <span className="font-medium">{form.email}</span>.
                O usuário receberá um link por e-mail para cadastrar sua senha.
              </p>
              <div className="flex justify-end">
                <Dialog.Close asChild>
                  <button
                    type='button'
                    className="rounded bg-main px-4 py-2 text-white cursor-pointer"
                  >
                    Concluir
                  </button>
                </Dialog.Close>
              </div>
            </div>
          ) : (
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

              <div className="mt-6 flex flex-col gap-2">
                <p>E-mail</p>
                <TextInput
                  placeholder='Digite o e-mail'
                  type='email'
                  aria-label='E-mail'
                  value={form.email}
                  onChange={(event) => form.setEmail(event.target.value)}
                />
                {form.fieldErrors.email && (
                  <span className="text-sm text-red-500">
                    {form.fieldErrors.email}
                  </span>
                )}
              </div>

              <div className='mt-6 flex flex-col gap-2'>
                <p>Cargo</p>
                <div className='flex flex-row flex-wrap gap-4'>
                  {userRoles.map((roleOption) => (
                    <label
                      key={roleOption}
                      className='flex items-center gap-1 cursor-pointer'
                    >
                      <input
                        type='radio'
                        name='role'
                        value={roleOption}
                        checked={form.role === roleOption}
                        onChange={() => form.setRole(roleOption)}
                      />
                      <span>{userRoleLabels[roleOption]}</span>
                    </label>
                  ))}
                </div>
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
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
