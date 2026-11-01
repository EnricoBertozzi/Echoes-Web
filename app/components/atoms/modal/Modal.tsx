import type React from "react";
import clsx from "clsx";
import { IoClose } from "react-icons/io5";

export interface ModalProps{
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
  className?: string
}

export function Modal({children, className, isOpen, onClose}: ModalProps) {
  if (!isOpen) return;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className={clsx('relative rounded-2xl bg-white p-8 pt-12', className ?? 'w-150')}>
        <button 
          type="button" 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-500 hover:text-black transition-colors"
        >
          <IoClose size={24} />
        </button>

        {children}
      </div>
    </div>
  );
}