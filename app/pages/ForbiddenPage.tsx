import { Link, useNavigate } from "react-router";

export default function ForbiddenPage() {
    
  const navigate = useNavigate(); 
  return (
    <div className="flex min-h-dvh w-full flex-col items-center justify-center gap-4 bg-zinc-200 px-4 py-6 text-center">
      <h1 className="text-5xl text-stone-700 sm:text-6xl">Oops!</h1>
      <h3 className="text-stone-700 text-2xl">Erro 403: Acesso Negado</h3>
      
      <Link className="text-stone-700 text-xl hover:underline decoration-stone-700" to="#" onClick={() => navigate(-1)} >
        Voltar
      </Link>
    </div>
  );
}
