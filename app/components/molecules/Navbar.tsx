import clsx from "clsx";
import { FaDog, FaSchool } from "react-icons/fa";
import { FiFileText, FiSearch, FiSettings, FiSliders, FiUser } from "react-icons/fi";
import { NavbarButton } from "../atoms/NavbarButton";
import { useAuth } from "~/context/AuthContext";

export interface NavbarProps {
  collapsed: boolean;
}

export function Navbar({ collapsed }: NavbarProps) {
  const { user } = useAuth();

  return (
      <ul className={clsx(
        'w-full flex flex-col gap-2',
        'transition-[padding] duration-500',
        collapsed ? 'pl-0' : 'pl-10'
      )}>
        <NavbarButton
          to='/dashboard'
          label='Dispositivos'
          collapse={collapsed}
          icon={FaDog}
          end
        />
        <NavbarButton
          to='/dashboard/terms'
          label='Termos'
          collapse={collapsed}
          icon={FiFileText}
        />
        <NavbarButton
          to='/dashboard/audit'
          label='Auditoria'
          collapse={collapsed}
          icon={FiSearch}
        />
        <NavbarButton
          to='/dashboard/settings'
          label='Configuração'
          collapse={collapsed}
          icon={FiSettings}
        />
        <NavbarButton
          to='/dashboard/school'
          label='Instituições'
          collapse={collapsed}
          icon={FaSchool}
        />
        {user?.role == "ADMIN" && (
          <NavbarButton
            to='/dashboard/admins'
            label='Administradores'
            collapse={collapsed}
            icon={FiUser}
          />
        )}
        {user?.role == "MANAGER" && (
          <NavbarButton
            to={`/dashboard/users/${user.institutionId}`}
            label='Membros'
            collapse={collapsed}
            icon={FiUser}
          />
        )}
        <NavbarButton
          to='/dashboard/scene'
          label='Cenários'
          collapse={collapsed}
          icon={FiSliders}
        />
      </ul>
  )
}
