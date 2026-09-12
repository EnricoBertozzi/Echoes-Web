import { Navbar } from "~/components/molecules/Navbar";
import type { Route } from "./+types/index";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Dispositivos — Echoes" }];
}

export default function DevicesPage() {
  return (
    <div>
      <Navbar title="Dispositivos" />
      <div className="p-6">
        <div className="rounded bg-white p-8 text-center text-zinc-500 shadow-sm">
          Gestão dos dispositivos de simulação em breve.
        </div>
      </div>
    </div>
  );
}
