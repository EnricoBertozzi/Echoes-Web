import { use, useState } from "react";
import { FiPlus } from "react-icons/fi";
import {
  userRoleLabels,
  userRoles,
  type CreateInstitutionalUserRequest,
} from "~/types/user";
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
import { useAuth } from "~/context/AuthContext";

export interface AddInstitutionalUserModalProps {
  institutionId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function AddInstitutionalUserModal({
  institutionId,
  isOpen,
  onClose,
}: AddInstitutionalUserModalProps) {
  const { control, register, handleSubmit } =
    useForm<CreateInstitutionalUserRequest>({
      defaultValues: {
        email: "",
        name: "",
        institutionId: institutionId,
        role: "student",
      },
    });

  const options = new Map<string, string>();
  options.set("student", "Aluno")
  options.set("manager", "Professor")
  options.set("teacher", "Gestor")

  const { error, loading, success, setSuccess, handleCreateInstitutionalUserSubmit } =
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
          <ModalForm onSubmit={handleSubmit(handleCreateInstitutionalUserSubmit)}>
            <input
              type="hidden"
              {...register("institutionId", { value: institutionId })}
            />

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

            <ControlledSelectField
              id="role"
              name="role"
              label="Função"
              options={options}
              placeholder={"Selecione uma função"}
              rules={{
                required: "Função obrigatória",
              }}
              control={control}
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
