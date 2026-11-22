import { useEffect, useId, useRef } from "react";
import { FiX } from "react-icons/fi";
import { Button } from "~/components/atoms/Button";

export interface ConfirmationOptions {
  title: string;
  description: string;
  confirmLabel: string;
  variant?: "primary" | "danger";
}

interface ConfirmMessageModalProps extends ConfirmationOptions {
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmMessageModal({
  title,
  description,
  confirmLabel,
  variant = "primary",
  onCancel,
  onConfirm,
}: ConfirmMessageModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();

    return () => dialog?.close();
  }, []);

  function cancel() {
    dialogRef.current?.close();
    onCancel();
  }

  function confirmAction() {
    dialogRef.current?.close();
    onConfirm();
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => {
        event.preventDefault();
        cancel();
      }}
      className="m-auto max-h-[calc(100dvh_-_2rem)] w-150 max-w-[calc(100%_-_2rem)] overflow-y-auto overscroll-contain rounded-2xl bg-white p-4 wrap-anywhere backdrop:bg-black/50 sm:p-8"
    >
      <header className="flex items-start justify-between gap-3">
        <h2 id={titleId} className="min-w-0 pt-1 text-2xl font-bold text-slate-900">
          {title}
        </h2>
        <button
          type="button"
          aria-label="Fechar"
          onClick={cancel}
          className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-lg text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-main"
        >
          <FiX size={24} aria-hidden="true" />
        </button>
      </header>
      <p id={descriptionId} className="mt-2 text-lg text-slate-600">
        {description}
      </p>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button type="button" label="Cancelar" variant="muted" onClick={cancel} />
        <Button type="button" label={confirmLabel} variant={variant} onClick={confirmAction} />
      </div>
    </dialog>
  );
}
