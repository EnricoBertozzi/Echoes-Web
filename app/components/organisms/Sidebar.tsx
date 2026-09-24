import clsx from "clsx";
import { FaArrowLeft  } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { useSidebar } from "~/hooks/useSidebar";
import Icon from '~/assets/icon.svg?react';
import { Navbar } from "../molecules/Navbar";
import { Button } from "../atoms/Button";
import { ModalButton } from "../atoms/modal/ModalButton";
import { useLogout } from "~/hooks/auth/useLogout";

export function Sidebar() {

  const sidebar = useSidebar();
  const collapsed = sidebar.state === 'collapse';
  const logout = useLogout()

  return (
    <aside className={clsx(
      'py-6 h-full bg-main transition-all overflow-hidden duration-500 flex flex-col items-center gap-8',
      collapsed ? 'w-16' : 'w-[22%]'
    )}>
      <header className={clsx(
        'w-full flex flex-row items-center',
        collapsed ? 'justify-center' : 'px-8 justify-end'
      )}>
        <button className='cursor-pointer' onClick={sidebar.toggleState}>
          {collapsed ? <FiMenu
            color='#fff'
            size={24}
          /> : <FaArrowLeft
            color='#fff'
            size={24}
          />}
        </button>
      </header>
      <div className='w-full h-1/4 flex justify-center items-center'>
        <div className={clsx(
          'w-1/2 aspect-square rounded-full bg-zinc-200',
          'transition-[padding] duration-500',
          collapsed ? 'p-1' : 'p-10 max-xl:p-8 max-lg:p-6 max-md:p-4'
        )}>
        <Icon className='w-full h-full fill-main'/>
        </div>
      </div>
      <Navbar collapsed={collapsed}/>
      {collapsed == false && (
        <div className="w-full flex justify-start p-10">
          <ModalButton label="Logout" className="bg-white" onAction={() => logout.onLogout()} />
        </div>
      )}
    </aside>
  )
}
