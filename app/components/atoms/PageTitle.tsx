import { Link } from "react-router";

interface PageTitleProps {
  title: string;
  description: string;
  backPath?: string;
}

export function PageTitle({ title, description, backPath }: PageTitleProps) {
  return (
    <header className="flex flex-col gap-2">
      {backPath != null && (
        <Link
          to={backPath}
          className="w-fit cursor-pointer  
                     hover:underline text-sm underline-offset-1 
                     decoration-slate-500  text-slate-500"
        >
          Voltar
        </Link>
      )}

      <h1 className="text-4xl font-bold text-slate-900">{title}</h1>

      <p className="text-xl text-slate-500">{description}</p>
    </header>
  );
}
