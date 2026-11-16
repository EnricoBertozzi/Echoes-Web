import clsx from "clsx";
import type { KeyboardEvent } from "react";

export interface TabItem<T extends string> {
  id: T;
  label: string;
  count?: number;
}

export interface TabBarProps<T extends string> {
  label: string;
  tabs: TabItem<T>[];
  active: T;
  onChange: (id: T) => void;
  className?: string;
}

/**
 * Abas sublinhadas, no estilo do Teams. O painel correspondente deve usar
 * id="panel-{id}", role="tabpanel" e aria-labelledby="tab-{id}".
 */
export function TabBar<T extends string>({
  label,
  tabs,
  active,
  onChange,
  className,
}: TabBarProps<T>) {
  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;

    event.preventDefault();

    const step = event.key === "ArrowRight" ? 1 : -1;
    const next = tabs[(index + step + tabs.length) % tabs.length];

    onChange(next.id);
    document.getElementById(`tab-${next.id}`)?.focus();
  }

  return (
    <div
      role="tablist"
      aria-label={label}
      className={clsx("flex gap-2 border-b border-slate-200", className)}
    >
      {tabs.map((tab, index) => {
        const selected = tab.id === active;

        return (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={`panel-${tab.id}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={clsx(
              "-mb-px flex cursor-pointer items-center gap-2 border-b-4 px-4 py-3 text-lg transition-colors",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main",
              selected
                ? "border-main font-bold text-main"
                : "border-transparent font-semibold text-slate-600 hover:border-slate-300 hover:text-slate-900",
            )}
          >
            {tab.label}

            {tab.count !== undefined && (
              <span
                className={clsx(
                  "rounded-full px-2 py-0.5 text-sm font-semibold",
                  selected ? "bg-main text-white" : "bg-slate-200 text-slate-700",
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
