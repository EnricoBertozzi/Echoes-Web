import { Link } from "react-router";

export default function UnathorizedPage() {
  return (
    <div className="h-full w-full bg-zinc-200 flex flex-col justify-center items-center gap-4">
      <h1 className="text-stone-700 text-6xl">Oops!</h1>
      <h3 className="text-stone-700 text-2xl">Erro 401: Usuário Não Autenticado</h3>

      <p className="text-stone-700 text-base">
        Para ir até o login, <Link to={"/"}>clique aqui</Link>
      </p>
    </div>
  );
}
