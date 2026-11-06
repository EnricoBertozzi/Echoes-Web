import { Link } from "react-router";

export function UnathorizedPage() {
    
  return (
    <div className="h-full w-full bg-zinc-200 flex flex-col">
      <h1>Oops!</h1>
      <h3>403 Acesso negado</h3>
      <Link to={"/"} >
        Voltar
      </Link>
    </div>
  );
}
