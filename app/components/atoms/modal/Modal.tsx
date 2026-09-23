import type React from "react";
import clsx from "clsx";

export interface ModalProps{
  children: React.ReactNode
  className?: string
}

export function Modal({children, className}: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className={clsx('rounded-2xl bg-white p-8', className ?? 'w-150')}>
        {children}
      </div>
    </div>
  );
}