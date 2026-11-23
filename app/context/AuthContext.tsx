import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";

import type { User } from "~/types/user";
import { fetchCurrentUser } from "~/api/users";
import { hasSessionHint, setSessionHint } from "~/utils/session";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      // sem marcador de sessão não há o que restaurar
      if (!hasSessionHint()) {
        if (active) setLoading(false);
        return;
      }

      try {
        const response = await fetchCurrentUser();

        if (active) {
          setUser(response.data);
        }
      } catch {
        if (active) {
          setUser(null);
          setSessionHint(false);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      active = false;
    };
  }, []);

  const login = (user: User) => {
    setUser(user);
  };

  const logout = () => {
    setSessionHint(false);
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }

  return context;
}
