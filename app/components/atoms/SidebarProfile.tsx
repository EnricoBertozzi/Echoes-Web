import clsx from "clsx";
import { useAuth } from "~/context/AuthContext";

interface SidebarProfileProps {
  collapsed: boolean;
}

export function SidebarProfile({ collapsed }: SidebarProfileProps) {
  const { user } = useAuth();

  if (!user) return null;

  const initial = user.name?.trim().charAt(0).toUpperCase() || "?";

  return (
    <div
      className={clsx(
        "flex items-center gap-3 h-14 transition-all duration-300",
        collapsed ? "w-full justify-center" : "w-full px-6",
      )}
      title={collapsed ? user.name : undefined}
    >
      <div
        className={clsx(
          "flex shrink-0 items-center justify-center",
          "rounded-full border border-white/50",
          "text-white font-semibold",
          collapsed ? "w-10 h-10 text-base" : "w-11 h-11 text-lg",
        )}
      >
        {initial}
      </div>

      {!collapsed && (
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-semibold text-white">
            {user.name}
          </span>

          <span className="truncate text-xs text-white/70">{user.email}</span>
        </div>
      )}
    </div>
  );
}
