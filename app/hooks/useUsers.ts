import { useCallback, useEffect, useRef, useState } from "react";
import { findAllUsers } from "~/api/users";
import { userRoles, type User, type UserRole } from "~/types/user";

type FetchState = | { type: "sucess" }
  | { type: "edit" }
  | { type: "delete" }
  | null;

export function useUsers() {
  const [users, setUsers] = useState<User[]>();
  const [state, setState] = useState<FetchState>(null);

  async function fetch(
    role: UserRole,
    page: number,
    size: number,
    institutionId?: string,
  ) {
    const response = await findAllUsers(role, {
      page: page,
      size: size,
      institutionId: institutionId,
    });

    const status = response.status;
    if (status === 200) {
      setUsers(response.data);
    } else {

    }
  }
}
