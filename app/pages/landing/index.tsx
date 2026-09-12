import { FaStethoscope } from "react-icons/fa";
import { Link } from "react-router";
import { Button } from "~/components/atoms/Button";
import type { Route } from "./+types/index";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Echoes — painel administrativo" },
    {
      name: "description",
      content:
        "Painel administrativo do Echoes, simulador de ausculta pulmonar e cardíaca canina para ensino veterinário.",
    },
  ];
}

export default function Landing() {
  return (
    <main className="flex min-h-screen flex-col bg-zinc-200">
      <header className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-2 text-main">
          <FaStethoscope className="text-2xl" />
          <span className="text-lg font-semibold">Echoes</span>
        </div>
        <Link to="/dashboard/school">
          <Button>Entrar no painel</Button>
        </Link>
      </header>

      <section className="flex flex-1 flex-col items-center justify-center gap-6 px-8 text-center">
        <h1 className="max-w-2xl text-4xl font-semibold text-zinc-900">
          Ausculta canina simulada, do jeito que seus alunos vão ouvir na
          clínica
        </h1>
        <p className="max-w-xl text-zinc-600">
          O Echoes reproduz sons pulmonares e cardíacos de cães em cenários
          controlados, para que instituições de ensino veterinário treinem
          diagnóstico por ausculta antes do primeiro paciente real.
        </p>
        <Link to="/dashboard/school">
          <Button className="px-6 py-3 text-base">
            Acessar painel administrativo
          </Button>
        </Link>
      </section>
    </main>
  );
}
