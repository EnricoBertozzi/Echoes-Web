import { Navbar } from "~/components/molecules/Navbar";
import type { Route } from "./+types/index";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Cenário — Echoes" }];
}

export default function ScenePage() {
  return (
    <div>
      <Navbar title="Cenário" />
      <div className="p-6">
        <div className="rounded bg-white p-8 text-center text-zinc-500 shadow-sm">
          Configuração de cenários de simulação em breve.
        </div>
      </div>
    </div>
  );
}
