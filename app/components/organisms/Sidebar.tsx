import clsx from "clsx";
import { useState } from "react";
import { FaMicrochip, FaCube, FaClipboardList } from "react-icons/fa";
import {
  FiChevronLeft,
  FiChevronRight,
  FiFileText,
  FiHome,
  FiSettings,
  FiUsers,
} from "react-icons/fi";
import { NavLink } from "react-router";
import { NavbarButton } from "~/components/atoms/NavbarButton";

const NAV_ITEMS = [
  { to: "/dashboard/school", label: "Instituições", icon: <FiHome /> },
  { to: "/dashboard/users", label: "Usuários", icon: <FiUsers /> },
  { to: "/dashboard/devices", label: "Dispositivos", icon: <FaMicrochip /> },
  { to: "/dashboard/scene", label: "Cenário", icon: <FaCube /> },
  { to: "/dashboard/audit", label: "Auditoria", icon: <FaClipboardList /> },
  { to: "/dashboard/terms", label: "Termos", icon: <FiFileText /> },
  { to: "/dashboard/settings", label: "Configurações", icon: <FiSettings /> },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={clsx(
        "flex h-screen flex-col bg-main transition-[width] duration-500",
        collapsed ? "w-16" : "w-[22%]",
      )}
    >
      <div className="flex items-center justify-between px-3 py-4">
        {!collapsed && (
          <span className="truncate text-sm font-semibold text-white">
            Echoes
          </span>
        )}
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="cursor-pointer rounded p-1 text-white/70 hover:bg-white/10 hover:text-white"
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
        >
          {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-2">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.to} to={item.to}>
            {({ isActive }) => (
              <NavbarButton
                icon={item.icon}
                label={collapsed ? "" : item.label}
                active={isActive}
                title={collapsed ? item.label : undefined}
              />
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
