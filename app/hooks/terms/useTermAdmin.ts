import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  createTerm,
  findTerms,
  updateTermContent,
  updateTermStatus,
} from "~/api/terms";
import type {
  CreateTermRequest,
  TermResponseDTO,
  TermStatus,
  TermType,
} from "~/types/terms";
import { termTypes } from "~/types/terms";

const typeOrder = new Map(termTypes.map((type, index) => [type, index]));

const statusOrder: Record<TermStatus, number> = {
  PUBLISHED: 0,
  DRAFT: 1,
  IN_REVIEW: 2,
  APPROVED: 3,
  ARCHIVED: 4,
};

export function sortTerms(terms: TermResponseDTO[]): TermResponseDTO[] {
  return [...terms].sort((a, b) => {
    const typeDifference =
      (typeOrder.get(a.type) ?? 0) - (typeOrder.get(b.type) ?? 0);

    if (typeDifference !== 0) {
      return typeDifference;
    }

    const statusDifference = statusOrder[a.status] - statusOrder[b.status];

    if (statusDifference !== 0) {
      return statusDifference;
    }

    return b.timestamp.localeCompare(a.timestamp);
  });
}

function archivePreviousPublished(
  terms: TermResponseDTO[],
  published: TermResponseDTO,
): TermResponseDTO[] {
  if (published.status !== "PUBLISHED") {
    return terms;
  }

  return terms.map((term) =>
    term.id !== published.id &&
    term.type === published.type &&
    term.status === "PUBLISHED"
      ? { ...term, status: "ARCHIVED" as TermStatus }
      : term,
  );
}

/**
 * Estado da administração de termos: histórico completo, criação, edição de
 * conteúdo (somente DRAFT) e mudança de status.
 */
export function useTermAdmin() {
  const [terms, setTerms] = useState<TermResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [acting, setActing] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const latestRequestRef = useRef(0);

  const refetch = useCallback(() => {
    setReloadKey((current) => current + 1);
  }, []);

  useEffect(() => {
    const requestId = ++latestRequestRef.current;

    setLoading(true);
    setError(null);

    findTerms()
      .then((result) => {
        if (latestRequestRef.current !== requestId) {
          return;
        }

        setTerms(sortTerms(result));
      })
      .catch((requestError: unknown) => {
        if (latestRequestRef.current !== requestId) {
          return;
        }

        setError(
          requestError instanceof Error
            ? requestError.message
            : "Erro ao carregar os termos.",
        );
      })
      .finally(() => {
        if (latestRequestRef.current === requestId) {
          setLoading(false);
        }
      });
  }, [reloadKey]);

  const publishedByType = useMemo(() => {
    const map = new Map<TermType, TermResponseDTO>();

    for (const term of terms) {
      if (term.status === "PUBLISHED") {
        map.set(term.type, term);
      }
    }

    return map;
  }, [terms]);

  const create = useCallback(async (data: CreateTermRequest) => {
    setActing(true);

    try {
      const created = await createTerm(data);

      setTerms((current) => {
        const withoutDuplicates = current.filter(
          (term) => term.id !== created.id,
        );

        return sortTerms([
          ...archivePreviousPublished(withoutDuplicates, created),
          created,
        ]);
      });

      return created;
    } catch {
      // o interceptor do axios já exibiu o erro
      return null;
    } finally {
      setActing(false);
    }
  }, []);

  const updateContent = useCallback(async (id: number, content: string) => {
    setActing(true);

    try {
      const updated = await updateTermContent(id, content);

      setTerms((current) =>
        sortTerms(current.map((term) => (term.id === updated.id ? updated : term))),
      );

      return updated;
    } catch {
      return null;
    } finally {
      setActing(false);
    }
  }, []);

  const changeStatus = useCallback(async (id: number, status: TermStatus) => {
    setActing(true);

    try {
      const updated = await updateTermStatus(id, status);

      setTerms((current) => {
        const withUpdated = current.map((term) =>
          term.id === updated.id ? updated : term,
        );

        return sortTerms(archivePreviousPublished(withUpdated, updated));
      });

      return updated;
    } catch {
      return null;
    } finally {
      setActing(false);
    }
  }, []);

  return {
    terms,
    publishedByType,
    loading,
    error,
    acting,
    refetch,
    createTerm: create,
    updateTermContent: updateContent,
    changeTermStatus: changeStatus,
  };
}
