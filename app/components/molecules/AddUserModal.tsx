import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { userRoleLabels, userRoles } from "~/types/user";
import { useCreateUser } from "~/hooks/useCreateUser";
import { TextInput } from "../atoms/TextInput";
import { Modal } from "../atoms/modal/Modal";
import { ModalTitle } from "../atoms/modal/ModalTitle";
import { ModalForm } from "../atoms/modal/ModalForm";
import { ModalButton } from "../atoms/modal/ModalButton";

export interface AddUserModalProps {
  onCreated?: () => void;
}

export function AddUserModal({ onCreated }: AddUserModalProps) {
  const [open, setOpen] = useState(false);
  const form = useCreateUser(onCreated);

  function handleClose() {
    setOpen(false);
    form.reset();
  }

  return (
    <>
      <button
        className='cursor-pointer'
        aria-label='Cadastrar usuário'
        onClick={() => setOpen(true)}
      >
        <FiPlus
          size={24}
          className='text-main hover:text-main/50 transition-all'
        />
      </button>

      {open && (
        <Modal>
          <ModalTitle
            title='Cadastrar usuário'
            description='Digite os dados do novo usuário'
          />

          {form.success ? (
            <div className="flex flex-col gap-4">
              <p className="text-sm">
                Convite enviado para <span className="font-medium">{form.email}</span>.
                O usuário receberá um link por e-mail para cadastrar sua senha.
              </p>
              <div className="flex justify-end">
                <ModalButton
                  label='Concluir'
                  onAction={handleClose}
                  className='bg-[#3730A3]'
                />
              </div>
            </div>
          ) : (
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

              <div className="flex flex-col gap-2">
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

              <div className='flex flex-col gap-2'>
                <p>Cargo</p>
                <div className='flex flex-row flex-wrap gap-4'>
                  {userRoles.map((roleOption) => (
                    <label
                      key={roleOption}
                      className='flex items-center gap-1 cursor-pointer text-black'
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
                <p className="text-sm text-red-500">{form.generalError}</p>
              )}

              <div className="flex justify-end gap-2">
                <ModalButton
                  label='Cancelar'
                  onAction={handleClose}
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
          )}
        </Modal>
      )}
    </>
  );
}
