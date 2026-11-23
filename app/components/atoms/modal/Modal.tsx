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
      <div
        className={clsx(
          "relative rounded-2xl bg-white p-8 pt-12",
          "max-sm:max-w-[calc(100%_-_2rem)] max-sm:px-4",
          "max-lg:max-h-[calc(100dvh_-_1rem)] max-lg:overflow-y-auto max-lg:overscroll-contain max-lg:wrap-anywhere",
          className ?? "w-150",
        )}
      >
        <button 
          type="button" 
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-2 right-2 grid size-11 place-items-center text-gray-500 transition-colors hover:text-black sm:top-4 sm:right-4"
        >
          <IoClose size={24} />
        </button>

        {children}
      </div>
    </div>
  );
}
