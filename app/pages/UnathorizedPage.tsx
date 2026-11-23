import { Link } from "react-router";

export default function UnathorizedPage() {
  return (
    <div className="flex min-h-dvh w-full flex-col items-center justify-center gap-4 bg-zinc-200 px-4 py-6 text-center">
      <h1 className="text-5xl text-stone-700 sm:text-6xl">Oops!</h1>
      <h3 className="text-stone-700 text-2xl">Erro 401: Usuário Não Autenticado</h3>

      <p className="text-stone-700 text-base">
        Para ir até o login, <Link to={"/"}>clique aqui</Link>
      </p>
    </div>
  );
}
