import { Navbar } from "~/components/molecules/Navbar";
import type { Route } from "./+types/index";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Termos — Echoes" }];
}

export default function TermsPage() {
  return (
    <div>
      <Navbar title="Termos" />
      <div className="p-6">
        <div className="rounded bg-white p-8 text-center text-zinc-500 shadow-sm">
          Gestão dos termos de uso em breve.
        </div>
      </div>
    </div>
  );
}
