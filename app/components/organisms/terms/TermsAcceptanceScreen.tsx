import { useState } from "react";

import { Button } from "~/components/atoms/Button";
import { Card } from "~/components/atoms/card/Card";
import { Markdown } from "~/components/atoms/Markdown";
import { Alert } from "~/components/atoms/page/Alert";
import { PageTitle } from "~/components/atoms/PageTitle";
import { TermStatusBadge } from "~/components/atoms/terms/TermStatusBadge";
import { useLogout } from "~/hooks/auth/useLogout";
import type { TermResponseDTO, TermType } from "~/types/terms";
import {
  formatTermTimestamp,
  termTypeLabels,
} from "~/types/terms";

export interface TermsAcceptanceScreenProps {
  pendingTypes: TermType[];
  terms: TermResponseDTO[];
  error: string | null;
  acceptingType: TermType | null;
  onAccept: (type: TermType) => Promise<boolean>;
  onRetry: () => void;
}

/**
 * Tela bloqueante exibida quando existe termo obrigatório publicado que o
 * usuário ainda não aceitou. Só desaparece quando todos forem aceitos.
 */
export function TermsAcceptanceScreen({
  pendingTypes,
  terms,
  error,
  acceptingType,
  onAccept,
  onRetry,
}: TermsAcceptanceScreenProps) {
  const [checkedTypes, setCheckedTypes] = useState<Set<TermType>>(new Set());
  const { onLogout } = useLogout();

  function toggleChecked(type: TermType) {
    setCheckedTypes((current) => {
      const next = new Set(current);

      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }

      return next;
    });
  }

  return (
    <main className="flex min-h-dvh w-full justify-center bg-zinc-200 px-4 py-6 max-lg:wrap-anywhere lg:h-full lg:min-h-0 lg:overflow-y-auto lg:py-10">
      <div className="flex w-full min-w-0 max-w-4xl flex-col gap-6">
        <header className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:flex-wrap">
          <PageTitle
            title="Termos atualizados"
            description="Para continuar usando o Echoes, leia e aceite os termos abaixo."
          />

          <form onSubmit={onLogout}>
            <button
              type="submit"
              className="cursor-pointer text-sm text-slate-500 underline underline-offset-2 hover:text-slate-800 max-lg:min-h-11"
            >
              Sair da conta
            </button>
          </form>
        </header>

        <Alert
          type="error"
          message={`${pendingTypes.length} termo(s) obrigatório(s) aguardando aceite. O acesso ao sistema permanece bloqueado até a conclusão.`}
        />

        {error && (
          <div className="flex flex-col gap-2">
            <Alert message={error} type="error" />
            <div className="w-full sm:w-40">
              <Button label="Tentar novamente" variant="muted" onClick={onRetry} />
            </div>
          </div>
        )}

        {pendingTypes.map((type) => {
          const term = terms.find((item) => item.type === type);
          const checked = checkedTypes.has(type);
          const accepting = acceptingType === type;
          const disabled = acceptingType !== null;

          if (!term) {
            return (
              <Card key={type} className="max-lg:p-4">
                <h2 className="text-2xl font-bold text-slate-900">
                  {termTypeLabels[type]}
                </h2>
                <Alert
                  message="Não foi possível carregar o conteúdo deste termo."
                  type="error"
                />
              </Card>
            );
          }

          return (
            <Card key={type} className="max-lg:p-4">
              <header className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 flex-col gap-1">
                  <h2 className="text-2xl font-bold text-slate-900">
                    {termTypeLabels[term.type]}
                  </h2>
                  <p className="text-sm text-slate-500">
                    Versão {term.version} · Atualizado em{" "}
                    {formatTermTimestamp(term.timestamp)}
                  </p>
                </div>

                <TermStatusBadge status={term.status} />
              </header>

              <div className="rounded border border-zinc-200 bg-zinc-50 px-3 py-4 sm:px-6 max-lg:[&_pre]:overflow-x-auto lg:max-h-96 lg:overflow-y-auto">
                <Markdown content={term.content} />
              </div>

              <label className="flex items-start gap-3 text-sm text-slate-700 max-lg:min-h-11">
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={disabled}
                  onChange={() => toggleChecked(type)}
                  className="mt-1 shrink-0"
                />

                <span>
                  Li e concordo com {termTypeLabels[type]} na versão{" "}
                  {term.version}.
                </span>
              </label>

              <div className="flex justify-end">
                <div className="w-full sm:w-48">
                  <Button
                    type="button"
                    label={accepting ? "Aceitando..." : "Aceitar termo"}
                    disabled={!checked || disabled}
                    onClick={() => void onAccept(type)}
                  />
                </div>
              </div>
            </Card>
          );
        })}

        <p className="pb-4 text-center text-sm text-slate-500">
          O acesso é liberado automaticamente após o aceite de todos os termos
          pendentes.
        </p>
      </div>
    </main>
  );
}
