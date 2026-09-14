import { useCallback, useEffect, useRef, useState } from "react";
import { findAllInstitutions } from "~/api/institutions";
import type { Institution } from "~/types/Institution";

export function useInstitutions(size = 12) {
  const [name, setNameState] = useState("");
  const [page, setPageState] = useState(0);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refetchKey, setRefetchKey] = useState(0);

  const latestRequestIdRef = useRef(0);

  useEffect(() => {
    const requestId = ++latestRequestIdRef.current;

    setLoading(true);
    setError(null);

    findAllInstitutions({ name: name || undefined, page, size })
      .then((result) => {
        if (latestRequestIdRef.current !== requestId) {
          return; // stale response: a newer name/page/refetch request is in flight
        }
        setInstitutions(result.content);
        setTotalElements(result.totalElements);
        setTotalPages(result.totalPages);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (latestRequestIdRef.current !== requestId) {
          return;
        }
        setError(err instanceof Error ? err.message : "Erro na requisição");
        setLoading(false);
      });
  }, [name, page, size, refetchKey]);

  const setName = useCallback((nextName: string) => {
    setNameState(nextName);
    setPageState(0);
  }, []);

  const setPage = useCallback((nextPage: number) => {
    setPageState(Math.max(0, nextPage));
  }, []);

  const refetch = useCallback(() => {
    setRefetchKey((key) => key + 1);
  }, []);

  return {
    name,
    setName,
    page,
    setPage,
    institutions,
    totalElements,
    totalPages,
    loading,
    error,
    refetch,
    hasNextPage: page < totalPages - 1,
    hasPrevPage: page > 0,
  };
}
