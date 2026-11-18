import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { ApiRequestError } from "~/api/axios";
import { deleteCurrentUser } from "~/api/users";
import { useAuth } from "~/context/AuthContext";

export function useDeleteAccount() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function resetError() {
    setError(null);
  }

  async function handleDeleteAccount(): Promise<boolean> {
    if (deleting) return false;

    setDeleting(true);
    setError(null);

    try {
      await deleteCurrentUser();

      logout();
      toast.success("Conta excluída com sucesso", {
        position: "bottom-right",
      });
      navigate("/", { replace: true });

      return true;
    } catch (requestError) {
      if (requestError instanceof ApiRequestError) {
        setError(requestError.message);
      } else {
        setError("Erro ao excluir a conta.");
      }

      setDeleting(false);
      return false;
    }
  }

  return { deleting, error, resetError, handleDeleteAccount };
}
