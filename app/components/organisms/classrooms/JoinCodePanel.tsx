import { useEffect, useState } from "react";
import { FiCopy } from "react-icons/fi";
import { toast } from "sonner";
import { Button } from "~/components/atoms/Button";
import { Card } from "~/components/atoms/card/Card";
import { formatCountdown } from "~/utils/classroomUi";

export interface JoinCodePanelProps {
  code: string | null;
  /** instante (ms) em que o código expira; null quando o prazo é desconhecido */
  expiresAt: number | null;
  archived: boolean;
  generating: boolean;
  onGenerate: () => void;
  onExpired: () => void;
}

/** Código de entrada da turma. Visível apenas para o professor. */
export function JoinCodePanel({
  code,
  expiresAt,
  archived,
  generating,
  onGenerate,
  onExpired,
}: JoinCodePanelProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!expiresAt) return;

    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 1000);

    return () => window.clearInterval(timer);
  }, [expiresAt]);

  const secondsLeft = expiresAt
    ? Math.max(0, Math.ceil((expiresAt - now) / 1000))
    : null;

  // ao zerar, busca a turma de novo: o backend já terá descartado o código
  useEffect(() => {
    if (secondsLeft === 0) onExpired();
  }, [secondsLeft, onExpired]);

  async function handleCopy() {
    if (!code) return;

    try {
      await navigator.clipboard.writeText(code);
      toast.success("Código copiado");
    } catch {
      toast.error("Não foi possível copiar. Selecione o código e copie manualmente.");
    }
  }

  return (
    <Card className="max-lg:p-4">
      <h2 className="text-2xl font-bold text-slate-900">Código de entrada</h2>

      {code ? (
        <>
          <div className="flex items-center justify-between gap-2 rounded-xl bg-slate-100 px-3 py-4 sm:gap-3 sm:px-5">
            <span
              className="select-all text-2xl font-bold tracking-[0.2em] text-slate-900 sm:text-3xl sm:tracking-[0.3em]"
              aria-label={`Código ${code.split("").join(" ")}`}
            >
              {code}
            </span>

            <button
              type="button"
              onClick={handleCopy}
              aria-label="Copiar código"
              className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-lg text-main hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-main lg:size-10"
            >
              <FiCopy size={24} />
            </button>
          </div>

          <p className="text-base text-slate-600" aria-live="polite">
            {secondsLeft !== null
              ? `Expira em ${formatCountdown(secondsLeft)}.`
              : "Código ativo."}{" "}
            Um novo código só pode ser gerado depois que este expirar.
          </p>
        </>
      ) : (
        <>
          <p className="text-base text-slate-600">
            {archived
              ? "Turma arquivada não aceita novos alunos."
              : "Não há código ativo. Gere um código para os alunos entrarem na turma. Ele vale por 15 minutos."}
          </p>

          <Button
            label={generating ? "Gerando..." : "Gerar código"}
            disabled={archived || generating}
            onClick={onGenerate}
          />
        </>
      )}
    </Card>
  );
}
