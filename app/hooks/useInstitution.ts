import { useCallback, useEffect, useState } from "react";
import { findInstitutionById } from "~/api/institutions";
import type { Institution } from "~/types/Institution";

export function useInstitution(id?: string) {
  const [institution, setInstitution] = useState<Institution>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchKey, setRefetchKey] = useState(0);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    findInstitutionById(id)
      .then(setInstitution)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Erro na requisição");
      })
      .finally(() => setLoading(false));
  }, [id, refetchKey]);

  const refetch = useCallback(() => setRefetchKey((key) => key + 1), []);

  return { institution, loading, error, refetch };
}
