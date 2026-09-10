import clsx from "clsx";
import { FaDog } from "react-icons/fa";
import { NavLink } from "react-router";

export interface NavbarButtonProps {
  to: string;
  label: string;
}

export function NavbarButton(props: NavbarButtonProps) {
  return (
    <NavLink
      to={props.to}
      className={({ isActive }) => clsx(
        'px-6 py-4 gap-3 rounded-l-xl flex flex-row',
        isActive ? 'bg-zinc-200 fill-main text-main' : 'bg-main fill-white text-white' 
      )}
      >
        <FaDog
          size={24}
        />
        <span className='font-semibold'>{props.label}</span>
    </NavLink>
  )
}
