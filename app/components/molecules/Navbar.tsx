import clsx from "clsx";
import { FaDog, FaSchool } from "react-icons/fa";
import { FiFileText, FiSearch, FiSettings, FiSliders, FiUser } from "react-icons/fi";
import { NavbarButton } from "../atoms/NavbarButton";

export interface NavbarProps {
  collapsed: boolean;
}

export function Navbar({ collapsed }: NavbarProps) {
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
        <NavbarButton
          to='/dashboard/users'
          label='Usuários'
          collapse={collapsed}
          icon={FiUser}
        />
        <NavbarButton
          to='/dashboard/scene'
          label='Cenários'
          collapse={collapsed}
          icon={FiSliders}
        />
      </ul>
  )
}
