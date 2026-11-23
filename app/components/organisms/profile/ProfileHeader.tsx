import { FiCheckCircle, FiHome, FiMail } from "react-icons/fi";

import { Card } from "~/components/atoms/card/Card";
import { UserAvatar } from "~/components/atoms/users/UserAvatar";
import { UserRoleBadge } from "~/components/atoms/users/UserRoleBadge";
import type { User } from "~/types/user";

export interface ProfileHeaderProps {
  user: User;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <Card>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <UserAvatar
          name={user.name}
          size="xl"
          className="ring-4 ring-main/10"
        />

        <div className="flex min-w-0 flex-col gap-3">
          <div className="flex min-w-0 flex-col gap-1">
            <h2 className="break-words text-3xl font-bold text-slate-900">
              {user.name}
            </h2>

            <p className="flex min-w-0 items-center gap-2 text-slate-500">
              <FiMail size={18} className="shrink-0" />
              <span className="min-w-0 wrap-anywhere sm:truncate" title={user.email}>
                {user.email}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <UserRoleBadge role={user.role} />

            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
              <FiHome size={16} />
              {user.institutionId
                ? "Instituição vinculada"
                : "Sem instituição"}
            </span>

            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
              <FiCheckCircle size={16} />
              Ativa
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
