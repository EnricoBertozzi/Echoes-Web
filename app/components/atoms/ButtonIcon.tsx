import type React from "react";

export interface ButtonIconProps {
  children: React.ReactNode;
  onClick: () => void
}

export function ButtonIcon(props: ButtonIconProps) {
  return (
    <button className="cursor-pointer flex" onClick={props.onClick}>
      {props.children}
    </button>
  )
}