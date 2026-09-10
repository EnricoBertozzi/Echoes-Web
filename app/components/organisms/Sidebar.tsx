import clsx from "clsx";
import { FaArrowLeft } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { useSidebar } from "~/hooks/useSidebar";
import Icon from '~/assets/icon.svg?react';
import { NavLink } from "react-router";
import { NavbarButton } from "../atoms/NavbarButton";

export function Sidebar() {

  const sidebar = useSidebar();

  return (
    <aside className={clsx(
      'py-6 h-full bg-main transition-all delay-150 flex flex-col items-center gap-8',
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
      <ul className='w-full pl-10 flex flex-col'>
        <NavbarButton
          to='/dashboard'
          label='Dispositivos'
        />
        <NavbarButton
          to='/dashboard/terms'
          label='Termos'
        />
      </ul>
    </aside>
  )
}
