import { Label } from "~/components/atoms/input/Label";
import { Markdown } from "~/components/atoms/Markdown";

export interface MarkdownEditorProps {
  id: string;
  name: string;
  label: string;
  value: string;
  error?: string;
  rows?: number;
  readOnly?: boolean;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

/**
 * Editor de Markdown em duas colunas: textarea à esquerda e preview à direita,
 * usando o mesmo componente `Markdown` da leitura dos termos.
 */
export function MarkdownEditor({
  id,
  name,
  label,
  value,
  error,
  rows = 20,
  readOnly = false,
  onChange,
  onBlur,
}: MarkdownEditorProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label id={id} name={name} label={label} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-2">
          <textarea
            id={id}
            name={name}
            value={value}
            rows={rows}
            readOnly={readOnly}
            onChange={(event) => onChange(event.target.value)}
            onBlur={onBlur}
            spellCheck={false}
            className={`
              min-h-80 w-full resize-y rounded-lg border p-4 font-mono text-sm
              text-slate-900 placeholder-slate-400 focus:outline-none transition-colors
              ${
                error
                  ? "border-red-500 focus:border-red-600"
                  : "border-slate-300 focus:border-slate-500"
              }
            `}
            placeholder={"# Título\n\nEscreva o conteúdo em Markdown..."}
          />

          {error && <span className="text-sm text-red-500">{error}</span>}
        </div>

        <div className="flex min-w-0 flex-col gap-2 lg:min-h-80">
          <span className="text-sm font-medium text-slate-500">Pré-visualização</span>

          <div className="min-h-48 min-w-0 flex-1 rounded-lg border border-slate-200 bg-zinc-50 px-3 py-4 sm:px-6 lg:min-h-80 lg:overflow-y-auto">
            {value.trim() ? (
              <Markdown content={value} />
            ) : (
              <p className="text-sm text-slate-400">
                A pré-visualização do Markdown aparecerá aqui.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
