import type React from "react";

export interface ModalProps{
  children: React.ReactNode
}

export function Modal({children}: ModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="w-150 rounded-2xl bg-white p-8">
        {children}
      </div>
    </div>
  );
}