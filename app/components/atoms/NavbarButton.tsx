import clsx from "clsx";
import type { IconType } from "react-icons";
import { NavLink } from "react-router";

export interface NavbarButtonProps {
  to: string;
  label: string;
  collapse: boolean;
  icon: IconType;
}

export function NavbarButton(props: NavbarButtonProps) {
  const Icon = props.icon;
  return (
    <NavLink
      to={props.to}
      className={({ isActive }) => clsx(
        'px-6 py-4 gap-3 flex flex-row',
        !props.collapse ? 'rounded-l-xl' : '',
        isActive ? 'bg-zinc-200 fill-main text-main' : 'bg-main fill-white text-white',
      )}
      >
        <Icon
          size={24}
        />
        {!props.collapse &&
          <span className='font-semibold'>{props.label}</span>}
    </NavLink>
  )
}
