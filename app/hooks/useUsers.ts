import { useCallback, useEffect, useRef, useState } from "react";
import { findAllUsers } from "~/api/users";
import type { User, UserRole } from "~/types/user";

export function useUsers(initialRole: UserRole = "admin", size = 10) {
  const [role, setRoleState] = useState<UserRole>(initialRole);
  const [page, setPageState] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
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

    findAllUsers(role, { page, size })
      .then((result) => {
        if (latestRequestIdRef.current !== requestId) {
          return; // stale response: a newer role/page/refetch request is in flight
        }
        setUsers(result.content);
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
  }, [role, page, size, refetchKey]);

  const setRole = useCallback((nextRole: UserRole) => {
    setRoleState(nextRole);
    setPageState(0);
  }, []);

  const setPage = useCallback((nextPage: number) => {
    setPageState(Math.max(0, nextPage));
  }, []);

  const refetch = useCallback(() => {
    setRefetchKey((key) => key + 1);
  }, []);

  return {
    role,
    setRole,
    page,
    setPage,
    users,
    totalElements,
    totalPages,
    loading,
    error,
    refetch,
    hasNextPage: page < totalPages - 1,
    hasPrevPage: page > 0,
  };
}
