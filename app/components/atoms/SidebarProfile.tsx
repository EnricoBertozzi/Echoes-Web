import clsx from "clsx";
import { FiChevronRight } from "react-icons/fi";
import { NavLink } from "react-router";

import { UserAvatar } from "~/components/atoms/users/UserAvatar";
import { useAuth } from "~/context/AuthContext";
import { roleToUserRole, userRoleLabels } from "~/types/user";

interface SidebarProfileProps {
  collapsed: boolean;
}

export function SidebarProfile({ collapsed }: SidebarProfileProps) {
  const { user } = useAuth();

  if (!user) return null;

  const roleLabel = userRoleLabels[roleToUserRole(user.role)];

  return (
    <NavLink
      to="/profile"
      aria-label={`Abrir perfil de ${user.name}, ${roleLabel}`}
      title={collapsed ? `Abrir perfil de ${user.name}` : undefined}
      className={({ isActive }) =>
        clsx(
          "flex h-14 w-full items-center gap-3 rounded-lg transition-all duration-300",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/70",
          collapsed ? "justify-center" : "px-6",
          isActive ? "bg-white/15" : "hover:bg-white/10",
        )
      }
    >
      <UserAvatar
        name={user.name}
        size={collapsed ? "sm" : "md"}
        variant="outline"
      />

      {!collapsed && (
        <>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-semibold text-white">
              {user.name}
            </span>

            <span className="truncate text-xs text-white/70">{roleLabel}</span>
          </div>

          <FiChevronRight size={16} className="shrink-0 text-white/50" />
        </>
      )}
    </NavLink>
  );
}
