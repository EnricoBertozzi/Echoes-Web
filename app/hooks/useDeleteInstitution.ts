import { useState } from "react";
import { extractErrorMessage } from "~/api/errors";
import { deleteInstitution } from "~/api/institutions";

interface UseDeleteInstitutionResult {
  remove: (id: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export function useDeleteInstitution(): UseDeleteInstitutionResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function remove(id: string): Promise<boolean> {
    setLoading(true);
    setError(null);
    try {
      await deleteInstitution(id);
      return true;
    } catch (err) {
      setError(extractErrorMessage(err));
      return false;
    } finally {
      setLoading(false);
    }
  }

  return { remove, loading, error };
}
