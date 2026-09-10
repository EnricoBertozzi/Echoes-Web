import clsx from "clsx";
import { FaArrowLeft, FaDog, FaSchool } from "react-icons/fa";
import { FiFileText, FiMenu, FiSearch, FiSettings, FiSliders, FiUser } from "react-icons/fi";
import { useSidebar } from "~/hooks/useSidebar";
import Icon from '~/assets/icon.svg?react';
import { NavLink } from "react-router";
import { NavbarButton } from "../atoms/NavbarButton";

export function Sidebar() {

  const sidebar = useSidebar();

  return (
    <aside className={clsx(
      'py-6 h-full bg-main transition-all duration-500 flex flex-col items-center gap-8',
      sidebar.state === 'collapse' ? 'w-16' : 'w-[22%]'
    )}>
      <header className={clsx(
        'w-full flex flex-row items-center',
        sidebar.state === 'collapse' ? 'justify-center' : 'px-8 justify-end'
      )}>
        <button className='cursor-pointer' onClick={sidebar.toggleState}>
          {sidebar.state === 'collapse' ? <FiMenu
            color='#fff'
            size={24}
          /> : <FaArrowLeft
            color='#fff'
            size={24}
          />}
        </button>
      </header>
      <div className={clsx(
        'w-1/2 aspect-square rounded-full bg-zinc-200 transition-all',
        sidebar.state === 'collapse' ? 'p-1' : 'p-10'
      )}>
        <Icon className='w-full h-full fill-main'/>
      </div>
      <ul className={clsx(
        'w-full flex flex-col overflow-hidden',
          sidebar.state === 'extend' ? 'pl-10' : ''
      )}>
        <NavbarButton
          to='/dashboard'
          label='Dispositivos'
          collapse={sidebar.state === 'collapse'}
          icon={FaDog}
        />
        <NavbarButton
          to='/dashboard/terms'
          label='Termos'
          collapse={sidebar.state === 'collapse'}
          icon={FiFileText}
        />
        <NavbarButton
          to='/dashboard/audit'
          label='Auditoria'
          collapse={sidebar.state === 'collapse'}
          icon={FiSearch}
        />
        <NavbarButton
          to='/dashboard/settings'
          label='Configuração'
          collapse={sidebar.state === 'collapse'}
          icon={FiSettings}
        />
        <NavbarButton
          to='/dashboard/school'
          label='Instituições'
          collapse={sidebar.state === 'collapse'}
          icon={FaSchool}
        />
        <NavbarButton
          to='/dashboard/users'
          label='Usuários'
          collapse={sidebar.state === 'collapse'}
          icon={FiUser}
        />
        <NavbarButton
          to='/dashboard/scene'
          label='Cenários'
          collapse={sidebar.state === 'collapse'}
          icon={FiSliders}
        />
      </ul>
    </aside>
  )
}
