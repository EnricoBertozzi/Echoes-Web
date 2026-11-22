import { useEffect, useId, useRef, useState } from "react";
import { FiX } from "react-icons/fi";
import { UserAvatar } from "~/components/atoms/users/UserAvatar";

interface UserDetailsModalProps {
  name: string;
  emailRequest: Promise<string | null>;
  onClose: () => void;
}

export function UserDetailsModal({
  name,
  emailRequest,
  onClose,
}: UserDetailsModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [email, setEmail] = useState<string | null>();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  useEffect(() => {
    let active = true;

    void emailRequest.then((value) => {
      if (active) setEmail(value);
    });

    return () => {
      active = false;
    };
  }, [emailRequest]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      className="m-auto max-h-[calc(100dvh_-_2rem)] w-md max-w-[calc(100%_-_2rem)] overflow-y-auto overscroll-contain rounded-2xl bg-white p-4 text-slate-900 wrap-anywhere backdrop:bg-black/50 sm:p-6"
    >
      <header className="flex items-center justify-between gap-3">
        <h2 id={titleId} className="text-xl font-semibold">
          Dados do usuário
        </h2>
        <button
          type="button"
          aria-label="Fechar"
          onClick={() => dialogRef.current?.close()}
          className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-lg text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-main"
        >
          <FiX size={24} aria-hidden="true" />
        </button>
      </header>

      <div className="mt-4 flex flex-col items-start gap-4">
        <UserAvatar name={name} size="lg" />
        <p className="text-lg font-semibold">{name}</p>

        <dl className="w-full">
          <dt className="text-sm font-medium text-slate-600">E-mail</dt>
          <dd className="mt-1">
            {email === undefined ? (
              <span role="status">Carregando e-mail…</span>
            ) : email === null ? (
              <span role="alert" className="text-red-700">
                Não foi possível carregar o e-mail.
              </span>
            ) : (
              email || "E-mail não informado."
            )}
          </dd>
        </dl>
      </div>
    </dialog>
  );
}
