import { useState } from "react";
import { FaUser } from "react-icons/fa6";
import { FiEye, FiEyeOff, FiTrash2 } from "react-icons/fi";

import { findUserEmail } from "~/api/users";
import { UserAvatar } from "~/components/atoms/users/UserAvatar";

export interface UserCardProps {
  id?: string;
  name: string;
  email: string;
  role: string;
  onDelete?: () => void;
}

export function UserCard({ id, name, email, role, onDelete }: UserCardProps) {
  const [revealedEmail, setRevealedEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  let labelRole = "";
  if (role === "STUDENT") labelRole = "Estudante";
  else if (role === "MANAGER") labelRole = "Gestor";
  else if (role === "TEACHER") labelRole = "Professor";
  else if (role === "ADMIN") labelRole = "Admin";

  async function toggleEmail() {
    if (revealedEmail !== null) {
      setRevealedEmail(null);
      return;
    }

    if (!id) return;

    setLoading(true);

    try {
      const fullEmail = await findUserEmail(id);
      setRevealedEmail(fullEmail);
    } catch {
      // o interceptor do axios já mostrou o erro
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-row gap-4 items-center rounded-lg p-5 w-full bg-white">
      <UserAvatar name={name} size="lg" />

      <div className="min-w-0 w-full flex flex-col justify-between">
        <p className="font-bold text-xl text-black max-w-full truncate">
          {name}
        </p>

        <p className="flex flex-row gap-2 items-center text-black">
          <span className="text-xl font-bold align-middle truncate">
            {revealedEmail ?? email}
          </span>

          {id && (
            <button
              type="button"
              onClick={toggleEmail}
              disabled={loading}
              aria-label={revealedEmail !== null ? "Ocultar e-mail" : "Mostrar e-mail"}
              title={revealedEmail !== null ? "Ocultar e-mail" : "Mostrar e-mail"}
              className="shrink-0 cursor-pointer text-main disabled:cursor-not-allowed disabled:opacity-50"
            >
              {revealedEmail !== null ? (
                <FiEyeOff size={20} aria-hidden="true" />
              ) : (
                <FiEye size={20} aria-hidden="true" />
              )}
            </button>
          )}
        </p>

        <p className="px-4 py-0.5 flex gap-2 items-center w-fit text-white bg-main rounded-full">
          <FaUser size={16} />
          <span className="text-base truncate">{labelRole}</span>
        </p>
      </div>

      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          aria-label={`Excluir ${name}`}
          className="shrink-0 cursor-pointer text-red-700 hover:text-red-500"
        >
          <FiTrash2 size={24} />
        </button>
      )}
    </div>
  );
}
