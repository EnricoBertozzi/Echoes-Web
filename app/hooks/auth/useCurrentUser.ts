import { useState } from "react";
import { fetchCurrentUSer as fetchCurrentUser } from "~/api/users";
import type { User } from "~/types/user";

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);

  async function handleFetchCurrentUser() {
    const response = await fetchCurrentUser();
    if (response.status === 200) {
      setUser(response.data);
    }
  }

  return {
    user,
    handleFetchCurrentUser,
  };
}
