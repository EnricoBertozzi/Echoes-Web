import { useState } from "react";
import { extractErrorMessage } from "~/api/errors";
import { updateInstitution } from "~/api/institutions";
import type { Institution, InstitutionPayload } from "~/types/Institution";

interface UseUpdateInstitutionResult {
  update: (id: string, payload: InstitutionPayload) => Promise<Institution | null>;
  loading: boolean;
  error: string | null;
}

export function useUpdateInstitution(): UseUpdateInstitutionResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function update(
    id: string,
    payload: InstitutionPayload,
  ): Promise<Institution | null> {
    setLoading(true);
    setError(null);
    try {
      return await updateInstitution(id, payload);
    } catch (err) {
      setError(extractErrorMessage(err));
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { update, loading, error };
}
