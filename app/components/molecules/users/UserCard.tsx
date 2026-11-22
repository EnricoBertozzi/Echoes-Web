import { useState } from "react";
import { FaUser } from "react-icons/fa6";
import { FiEye, FiTrash2 } from "react-icons/fi";

import { findUserEmail } from "~/api/users";
import { ButtonIcon } from "~/components/atoms/ButtonIcon";
import { UserAvatar } from "~/components/atoms/users/UserAvatar";
import { UserDetailsModal } from "./UserDetailsModal";

export interface UserCardProps {
  id?: string;
  name: string;
  email?: string;
  role: string;
  onDelete?: () => void;
}

export function UserCard({ id, name, email, role, onDelete }: UserCardProps) {
  const [emailRequest, setEmailRequest] = useState<Promise<string | null> | null>(
    null,
  );

  let labelRole = "";
  if (role === "STUDENT") labelRole = "Estudante";
  else if (role === "MANAGER") labelRole = "Gestor";
  else if (role === "TEACHER") labelRole = "Professor";
  else if (role === "ADMIN") labelRole = "Admin";

  function openDetails() {
    setEmailRequest(
      id
        ? findUserEmail(id).then((value) => value ?? "", () => null)
        : Promise.resolve(email ?? ""),
    );
  }

  return (
    <div className="flex w-full items-center gap-3 rounded-lg bg-white p-5 sm:gap-4">
      <UserAvatar name={name} size="lg" className="max-lg:hidden" />

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <p className="font-bold text-xl text-black max-w-full truncate">
          {name}
        </p>

        <p className="flex w-fit max-w-full items-center gap-2 rounded-full bg-main px-2 py-0.5 text-white sm:px-4">
          <FaUser size={16} className="shrink-0" />
          <span className="text-base truncate">{labelRole}</span>
        </p>
      </div>

      <div className="flex shrink-0 gap-1 self-start">
        <ButtonIcon label={`Visualizar dados de ${name}`} onClick={openDetails}>
          <FiEye size={22} className="text-main" aria-hidden="true" />
        </ButtonIcon>
        {onDelete && (
          <ButtonIcon label={`Excluir ${name}`} onClick={onDelete}>
            <FiTrash2 size={22} className="text-red-900" aria-hidden="true" />
          </ButtonIcon>
        )}
      </div>

      {emailRequest && (
        <UserDetailsModal
          name={name}
          emailRequest={emailRequest}
          onClose={() => setEmailRequest(null)}
        />
      )}
    </div>
  );
}
