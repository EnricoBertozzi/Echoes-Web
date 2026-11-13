import clsx from "clsx";
import { RiLogoutBoxLine } from "react-icons/ri";

interface LogoutSidebarProps {
  collapsed: boolean;
  onClick: () => void;
}

export function LogoutSidebar({ collapsed, onClick }: LogoutSidebarProps) {
  return (
    <div
      className={clsx(
        "w-full transition-[padding] duration-500",
        collapsed ? "pl-0" : "pl-10",
      )}
    >
      <button
        type="button"
        onClick={onClick}
        title={collapsed ? "Logout" : undefined}
        aria-label="Logout"
        className={clsx(
          "w-full flex flex-row items-center gap-3",
          "text-white bg-main cursor-pointer",
          collapsed ? "justify-center p-4" : "rounded-l-xl px-6 py-4",
        )}
      >
        <RiLogoutBoxLine size={24} className="shrink-0" />

        {!collapsed && <span className="font-semibold">Logout</span>}
      </button>
    </div>
  );
}
