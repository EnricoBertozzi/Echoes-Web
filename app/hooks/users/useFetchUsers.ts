import { useCallback, useState } from "react";
import { findAllUsers, findUsersByName } from "~/api/users";
import type { User, UserRole } from "~/types/user";

export function useFetchUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchAdminUsers = useCallback(
    async (
      role: UserRole,
      page: number,
      size: number,
      institutionId?: string,
    ) => {
      setLoading(true);
      setError(null);

      try {
        const response = await findAllUsers(role, {
          page,
          size,
          institutionId,
        });

        setUsers(response.data.content);
        setTotalElements(response.data.totalElements);
        setTotalPages(response.data.totalPages);
      } catch {
        setError("Não foi possível buscar os usuários");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const fetchAdminUsersByName = useCallback(
    async (role: UserRole, name: string, page: number, size: number) => {
      setLoading(true);
      setError(null);

      try {
        const res = await findUsersByName(role, name, {
          page: page,
          size: size,
        });
        setUsers(res.data.content);
      } catch {
        setError("Não foi possível buscar os usuários");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const fetchUsersByInstitution = useCallback(
    async (role: UserRole, name: string, page: number, size: number) => {
      setLoading(true);
      setError(null);

      try {
        const res = await findUsersByName(role, name, {
          page: page,
          size: size,
        });
        setUsers(res.data.content);
      } catch {
        setError("Não foi possível buscar os usuários");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    users,
    loading,
    error,
    totalElements,
    totalPages,
    fetchAdminUsers,
    fetchAdminUsersByName,
  };
}
