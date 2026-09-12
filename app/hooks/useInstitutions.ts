import { useCallback, useEffect, useState } from "react";
import { extractErrorMessage } from "~/api/errors";
import { getInstitution } from "~/api/institutions";
import type { Institution } from "~/types/Institution";

interface UseInstitutionResult {
  institution: Institution | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useInstitution(id: string | undefined): UseInstitutionResult {
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);

  const refetch = useCallback(() => setRefreshToken((t) => t + 1), []);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    getInstitution(id)
      .then((result) => {
        if (!cancelled) setInstitution(result);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(extractErrorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, refreshToken]);

  return { institution, loading, error, refetch };
}
