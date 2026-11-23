import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import {
  listRestorations,
  restorationStatuses,
  restorationTypes,
  type RestorationSummary,
} from "~/api/restorations";
import { Button } from "~/components/atoms/Button";
import { PageTitle } from "~/components/atoms/PageTitle";
import { Card } from "~/components/atoms/card/Card";
import { Main } from "~/components/atoms/page/Main";
import { PaginationSelector } from "~/components/atoms/page/PaginationSelector";
import { formatAuditTimestamp } from "~/types/audit";
import type { Page } from "~/types/user";

export default function Restorations() {
  const [params, setParams] = useSearchParams();
  const [result, setResult] = useState<Page<RestorationSummary>>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  const page = Math.min(2_147_483_647, Math.max(0, Number.parseInt(params.get("page") ?? "", 10) || 0));
  const size = [10, 20, 50].find((option) => String(option) === params.get("size")) ?? 20;
  const type = Object.keys(restorationTypes).find((key) => key === params.get("type"));
  const status = Object.keys(restorationStatuses).find((key) => key === params.get("status"));
  const query = params.toString();

  useEffect(() => {
    let current = true;
    setLoading(true);
    setError("");
    void listRestorations({ page, size, type, status })
      .then((data) => {
        if (current) setResult(data);
      })
      .catch((failure: unknown) => {
        if (current) setError(failure instanceof Error ? failure.message : "Falha ao carregar restaurações.");
      })
      .finally(() => {
        if (current) setLoading(false);
      });
    return () => { current = false; };
  }, [page, size, type, status, revision]);

  function changeFilter(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.delete("page");
    setParams(next);
  }

  return (
    <Main>
      <PageTitle title="Restaurações" backPath="/audit"
        description="Recupere turmas e instituições excluídas e confira os vínculos que podem voltar com elas." />
      <Card>
        <div className="flex flex-wrap gap-4">
          <label className="grid gap-1 text-sm font-medium text-slate-900">
            Tipo
            <select className="rounded-md border border-slate-300 px-3 py-2"
              value={type ?? ""} onChange={(event) => changeFilter("type", event.target.value)}>
              <option value="">Todos os tipos</option>
              {Object.entries(restorationTypes).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          <label className="grid gap-1 text-sm font-medium text-slate-900">
            Status
            <select className="rounded-md border border-slate-300 px-3 py-2"
              value={status ?? ""} onChange={(event) => changeFilter("status", event.target.value)}>
              <option value="">Todos os status</option>
              {Object.entries(restorationStatuses).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
        </div>
        <div aria-busy={loading}>
          {loading && <p role="status" className="text-slate-600">Carregando restaurações…</p>}
          {!loading && error && (
            <div className="grid gap-3">
              <p role="alert" className="text-red-700">{error}</p>
              <Button type="button" className="max-w-48" label="Tentar novamente"
                onClick={() => setRevision((value) => value + 1)} />
            </div>
          )}
          {!loading && !error && result && (
            <div className="grid gap-4">
              {result.content.length === 0 ? (
                <p className="text-slate-600">Nenhum caso encontrado para estes filtros.</p>
              ) : (
                <ul aria-label="Casos de restauração" className="divide-y divide-slate-200 border-y border-slate-200">
                  {result.content.map((item) => (
                    <li key={`${item.type}-${item.id}`}>
                      <Link to={`/audit/restorations/${item.type}/${item.id}${query ? `?${query}` : ""}`}
                        className="grid items-center gap-2 px-2 py-4 text-sm text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-main md:grid-cols-[minmax(0,2fr)_1fr_1fr]">
                        <span className="grid gap-1">
                          <span className="font-semibold text-main underline-offset-4 hover:underline">{item.name}</span>
                          <span>{item.type === "INSTITUTION" ? "Instituição e vínculos existentes" :
                            item.rosterRecorded ? "Turma e vínculos elegíveis" : "Somente a turma"}</span>
                        </span>
                        <span>{item.deletedAt ? formatAuditTimestamp(item.deletedAt) : "Data da exclusão indisponível"}</span>
                        <span className="font-medium">{restorationStatuses[item.status]}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              {(result.totalPages > 0 || page > 0) && (
                <PaginationSelector label="Casos por página" page={page} totalPages={result.totalPages}
                  size={size} sizeOptions={[10, 20, 50]} onChange={(value) => changeFilter("size", value)}
                  prevPage={() => changeFilter("page", String(page - 1))}
                  nextPage={() => changeFilter("page", String(page + 1))} />
              )}
            </div>
          )}
        </div>
      </Card>
    </Main>
  );
}
