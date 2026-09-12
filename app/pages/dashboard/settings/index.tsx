import { Navbar } from "~/components/molecules/Navbar";
import type { Route } from "./+types/index";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Configurações — Echoes" }];
}

export default function SettingsPage() {
  return (
    <div>
      <Navbar title="Configurações" />
      <div className="p-6">
        <div className="rounded bg-white p-8 text-center text-zinc-500 shadow-sm">
          Configurações do painel em breve.
        </div>
      </div>
    </div>
  );
}
