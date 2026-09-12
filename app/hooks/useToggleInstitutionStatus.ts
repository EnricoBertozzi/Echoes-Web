import { useState } from "react";
import { extractErrorMessage } from "~/api/errors";
import { toggleInstitutionStatus } from "~/api/institutions";

interface UseToggleInstitutionStatusResult {
  toggle: (id: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export function useToggleInstitutionStatus(): UseToggleInstitutionStatusResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggle(id: string): Promise<boolean> {
    setLoading(true);
    setError(null);
    try {
      await toggleInstitutionStatus(id);
      return true;
    } catch (err) {
      setError(extractErrorMessage(err));
      return false;
    } finally {
      setLoading(false);
    }
  }

  return { toggle, loading, error };
}
