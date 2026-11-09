import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { userRoleLabels, userRoles } from "~/types/user";
import { useCreateUser } from "~/hooks/users/useCreateUser";
import { TextInput } from "../../atoms/input/TextInput";
import { Modal } from "../../atoms/modal/Modal";
import { ModalTitle } from "../../atoms/modal/ModalTitle";
import { ModalForm } from "../../atoms/modal/ModalForm";
import { ModalButton } from "../../atoms/modal/ModalButton";
import { TextField } from "../input/TextField";
import { Controller, useForm } from "react-hook-form";
import { ControlledTextField } from "../controlled/ControlledTextField";
import { ControlledEmailField } from "../controlled/ControlledEmailField";
import { ControlledSelectField } from "../controlled/ControlledSelectField";

export interface AddAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
}

export function AddAdminModal({ isOpen, onClose }: AddAdminModalProps) {
  const { control, handleSubmit } = useForm<FormData>();

  const { error, loading, success, setSuccess, handleCreateAdminUserSubmit } =
    useCreateUser();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {success ? (
        <>
          <ModalTitle
            title="Convite Enviado"
            description="Um convite foi enviado ao e-mail do usuário para finalização do cadastro"
          />
          <div className="flex flex-col gap-4">
            <div className="flex justify-end">
              <ModalButton
                label="Fechar"
                variant="primary"
                onAction={() => {
                  setSuccess(false);
                  onClose();
                }}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <ModalTitle
            title="Cadastrar Usuário"
            description="Digite os dados do novo usuário"
          />
          <ModalForm onSubmit={handleSubmit(handleCreateAdminUserSubmit)}>
            <ControlledTextField
              id="name"
              name="name"
              label="Nome"
              placeholder="Digite o nome"
              control={control}
              rules={{
                required: "Nome obrigatório",
              }}
            />

            <ControlledEmailField
              id="email"
              name="email"
              label="E-mail"
              placeholder="Digite o e-mail"
              control={control}
              rules={{
                required: "E-mail obrigatório",
              }}
            />

            {error && <span className="text-red-500 text-sm">{error}</span>}

            <div className="flex justify-end gap-2">
              <ModalButton
                label="Fechar"
                variant="secondary"
                onAction={onClose}
              />

              <ModalButton
                type="submit"
                label={loading ? "Enviando" : "Salvar"}
                disabled={loading}
                variant="primary"
              />
            </div>
          </ModalForm>
        </>
      )}
    </Modal>
  );
}
