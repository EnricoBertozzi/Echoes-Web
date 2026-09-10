import clsx from "clsx";
import { FaArrowLeft } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { useSidebar } from "~/hooks/useSidebar";

export function Sidebar() {

  const sidebar = useSidebar();

  return (
    <aside className={clsx(
      'py-6 h-full bg-[#043369] transition-all delay-150 flex flex-col items-center gap-8',
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
      <div
        className='w-1/2 aspect-square rounded-full bg-zinc-200'
      />
    </aside>
  )
}
