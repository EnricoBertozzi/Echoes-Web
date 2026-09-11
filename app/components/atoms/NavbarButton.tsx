import clsx from "clsx";
import type { IconType } from "react-icons";
import { NavLink } from "react-router";

export interface NavbarButtonProps {
  to: string;
  label: string;
  collapse: boolean;
  icon: IconType;
  end?: boolean;
}

export function NavbarButton(props: NavbarButtonProps) {
  const Icon = props.icon;
  return (
    <NavLink
      end={props.end}
      to={props.to}
      className={({ isActive }) => clsx(
        'relative gap-3 flex flex-row transition-[border-radius]',
        !props.collapse ?
          'rounded-l-xl px-6 py-4' :
          'p-4 justify-center items-center',
        isActive ?
          'bg-zinc-200 fill-main text-main' :
          'bg-main fill-white text-white',
        isActive ? `
        before:absolute
        before:-right-2
        before:-top-2
        before:size-4
        before:bg-main
        before:border-zinc-200
        before:border-r-8
        before:border-b-8
        before:rounded-br-4xl

        after:absolute
        after:-right-2
        after:-bottom-2
        after:size-4
        after:bg-main
        after:border-zinc-200
        after:border-r-8
        after:border-t-8
        after:rounded-tr-4xl
        ` : '',
      )}
      >
        <Icon
          size={24}
        />
        {!props.collapse &&
          <span className='font-semibold w-full overflow-hidden'>{props.label}</span>}
    </NavLink>
  )
}
