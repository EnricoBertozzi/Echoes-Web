import { useState } from "react";
import { toast } from "sonner";

import { changePassword } from "~/api/auth";
import { ApiRequestError } from "~/api/axios";

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export type ChangePasswordResult =
  | { success: true }
  | {
      success: false;
      message: string;
      fieldErrors?: Record<string, string>;
    };

export function useChangePassword() {
  const [loading, setLoading] = useState(false);

  async function handleChangePassword(
    data: ChangePasswordInput,
  ): Promise<ChangePasswordResult> {
    setLoading(true);

    try {
      await changePassword(data);

      toast.success("Senha alterada com sucesso", {
        position: "bottom-right",
      });

      return { success: true };
    } catch (error) {
      if (error instanceof ApiRequestError) {
        if (error.fieldErrors) {
          return {
            success: false,
            message: "Verifique os campos informados.",
            fieldErrors: error.fieldErrors,
          };
        }

        // O backend devolve 400 com "Erro ao autenticar" quando a senha
        // atual não confere; traduzimos para uma mensagem mais clara.
        if (error.status === 400) {
          return { success: false, message: "Senha atual incorreta." };
        }

        return { success: false, message: error.message };
      }

      return {
        success: false,
        message: "Erro ao alterar a senha.",
      };
    } finally {
      setLoading(false);
    }
  }

  return { loading, handleChangePassword };
}
