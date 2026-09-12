import { Navbar } from "~/components/molecules/Navbar";
import type { Route } from "./+types/index";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Usuários — Echoes" }];
}

export default function UsersPage() {
  return (
    <div>
      <Navbar title="Usuários" />
      <div className="p-6">
        <div className="rounded bg-white p-8 text-center text-zinc-500 shadow-sm">
          Gestão de usuários em breve.
        </div>
      </div>
    </div>
  );
}
