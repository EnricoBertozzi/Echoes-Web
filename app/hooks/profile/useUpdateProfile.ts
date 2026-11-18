import { useState } from "react";
import { toast } from "sonner";

import { ApiRequestError } from "~/api/axios";
import { updateCurrentUser } from "~/api/users";
import { useAuth } from "~/context/AuthContext";

export interface UpdateProfileInput {
  name: string;
  email: string;
}

export type UpdateProfileResult =
  | { success: true }
  | {
      success: false;
      message: string;
      fieldErrors?: Record<string, string>;
    };

export function useUpdateProfile() {
  const { updateUser } = useAuth();
  const [loading, setLoading] = useState(false);

  async function handleUpdateProfile(
    data: UpdateProfileInput,
  ): Promise<UpdateProfileResult> {
    setLoading(true);

    try {
      const updatedUser = await updateCurrentUser({
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
      });

      updateUser(updatedUser);
      toast.success("Dados atualizados com sucesso", {
        position: "bottom-right",
      });

      return { success: true };
    } catch (error) {
      if (error instanceof ApiRequestError) {
        // E-mail em uso é um erro de campo, além de ser exibido no alerta.
        if (error.status === 409) {
          return {
            success: false,
            message: error.message,
            fieldErrors: { email: error.message },
          };
        }

        return {
          success: false,
          message: error.message,
          fieldErrors: error.fieldErrors,
        };
      }

      return {
        success: false,
        message: "Erro ao atualizar os dados.",
      };
    } finally {
      setLoading(false);
    }
  }

  return { loading, handleUpdateProfile };
}
