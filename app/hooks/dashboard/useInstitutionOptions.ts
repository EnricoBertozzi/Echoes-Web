import { useEffect, useState } from "react";
import { findAllInstitutions } from "~/api/institutions";
import type { Institution } from "~/types/Institution";

/**
 * Instituições para o filtro e para a aprovação. Só as ativas entram na
 * aprovação (aprovar para instituição inativa ainda é uma decisão em aberto).
 */
export function useInstitutionOptions(enabled: boolean) {
  const [institutions, setInstitutions] = useState<Institution[]>([]);

  useEffect(() => {
    if (!enabled) return;

    let active = true;
    findAllInstitutions({ page: 0, size: 200 })
      .then((result) => {
        if (active) setInstitutions(result.content);
      })
      .catch(() => {
        // o interceptor do axios já mostrou o erro
      });

    return () => {
      active = false;
    };
  }, [enabled]);

  return institutions;
}
