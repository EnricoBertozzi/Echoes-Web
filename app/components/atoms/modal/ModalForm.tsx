
export interface ModalFormProps{
  children: React.ReactNode,
  onSubmit: React.FormEventHandler<HTMLFormElement>
}

export function ModalForm({children, onSubmit}: ModalFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex text-black flex-col gap-5">
      {children}
    </form>
  );
}
