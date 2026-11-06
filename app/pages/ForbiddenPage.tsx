import { Link, useNavigate } from "react-router";

export default function ForbiddenPage() {
    
  const navigate = useNavigate(); 
  return (
    <div className="h-full w-full bg-zinc-200 flex flex-col justify-center items-center gap-4">
      <h1 className="text-stone-700 text-6xl">Oops!</h1>
      <h3 className="text-stone-700 text-2xl">Erro 403: Acesso Negado</h3>
      
      <Link className="text-stone-700 text-xl hover:underline decoration-stone-700" to="#" onClick={() => navigate(-1)} >
        Voltar
      </Link>
    </div>
  );
}
