import clsx from "clsx";
import { FiShield } from "react-icons/fi";

import {
  roleToUserRole,
  userRoleLabels,
  type ApiRole,
} from "~/types/user";

export interface UserRoleBadgeProps {
  role: ApiRole;
  className?: string;
}

export function UserRoleBadge({ role, className }: UserRoleBadgeProps) {
  const label = userRoleLabels[roleToUserRole(role)];

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-2 rounded-full bg-main/10 px-3 py-1 text-sm font-medium text-main",
        className,
      )}
    >
      <FiShield size={16} />
      {label}
    </span>
  );
}
