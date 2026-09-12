import { useState } from "react";
import { extractErrorMessage } from "~/api/errors";
import { createInstitution } from "~/api/institutions";
import type { Institution, InstitutionPayload } from "~/types/Institution";

interface UseCreateInstitutionResult {
  create: (payload: InstitutionPayload) => Promise<Institution | null>;
  loading: boolean;
  error: string | null;
}

export function useCreateInstitution(): UseCreateInstitutionResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create(payload: InstitutionPayload): Promise<Institution | null> {
    setLoading(true);
    setError(null);
    try {
      return await createInstitution(payload);
    } catch (err) {
      setError(extractErrorMessage(err));
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { create, loading, error };
}
