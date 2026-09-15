export interface ModalTitleProps {
  title: string;
  description: string;
}

export function ModalTitle({ title, description }: ModalTitleProps) {
  return (
    <div className="mb-6 flex flex-col gap-1">
      <h2 className="text-2xl font-bold text-slate-900">
        {title}
      </h2>
      <p className="text-lg text-slate-600">
        {description}
      </p>
    </div>
  );
}
