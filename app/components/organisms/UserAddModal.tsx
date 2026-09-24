import { useCreateUser } from "~/hooks/useCreateUser";
import { Modal } from "../atoms/modal/Modal";
import { ModalTitle } from "../atoms/modal/ModalTitle";
import { ModalForm } from "../atoms/modal/ModalForm";
import { ModalTextField } from "../atoms/modal/ModalTextField";
import { ModalFormButtons } from "../molecules/ModalFormButtons";

export interface UserAddModalProps {
  onClose(): void;
  onCreated?: () => void;
}

export function UserAddModal({ onClose, onCreated }: UserAddModalProps) {
  console.log('Rendered usermodal')
  const form = useCreateUser(onCreated);

  return (
    <Modal>
      <ModalTitle
        title='Cadastrar usuáŕio'
        description='Digite os dados do novo usuário'
      />
      <ModalForm onSubmit={form.handleSubmit}>
        <ModalTextField
          id='name'
          label='Nome'
          onChange={form.setName}
          value={form.name}
        />
        <ModalTextField
          id='email'
          label='E-mail'
          onChange={form.setEmail}
          value={form.email}
        />
        <ModalFormButtons confirmLabel={"Cadastrar"} onClose={onClose} />
      </ModalForm>
    </Modal>
  )
}
