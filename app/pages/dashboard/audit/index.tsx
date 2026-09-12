import { Navbar } from "~/components/molecules/Navbar";
import type { Route } from "./+types/index";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Auditoria — Echoes" }];
}

export default function AuditPage() {
  return (
    <div>
      <Navbar title="Auditoria" />
      <div className="p-6">
        <div className="rounded bg-white p-8 text-center text-zinc-500 shadow-sm">
          Trilha de auditoria em breve.
        </div>
      </div>
    </div>
  );
}
