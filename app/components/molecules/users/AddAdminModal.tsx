import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { userRoleLabels, userRoles } from "~/types/user";
import { useCreateUser } from "~/hooks/useCreateUser";
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
  onCreated?: () => void;
}

interface FormData {
  name: string;
  email: string;
}

export function AddAdminModal({ isOpen, onClose }: AddAdminModalProps) {
  const { control, handleSubmit } = useForm<FormData>();

  const {error, loading, handleCreateUserSubmit} = useCreateUser();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {false ? (
        <>
          <ModalTitle
            title="Cadastrar usuário"
            description="Um convite foi enviado para o e-mail cadastrado para finalização do cadastro"
          />
          <div className="flex flex-col gap-4">
            <p className="text-sm">
              Convite enviado para{" "}
              <span className="font-medium">{}</span>. O usuário
              receberá um link por e-mail para cadastrar sua senha.
            </p>
            <div className="flex justify-end">
              <ModalButton
                label="Concluir"
                onAction={onClose}
                className="bg-[#3730A3]"
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <ModalTitle
            title="Cadastrar usuário"
            description="Digite os dados do novo usuário"
          />
          <ModalForm onSubmit={handleSubmit(handleCreateUserSubmit)}>
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
                label="Cancelar"
                onAction={onClose}
                className="bg-stone-300"
              />

              <button
                type="submit"
                className="rounded bg-main px-4 py-2 text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Enviando..." : "Salvar"}
              </button>
            </div>
          </ModalForm>
        </>
      )}
    </Modal>
  );
}
