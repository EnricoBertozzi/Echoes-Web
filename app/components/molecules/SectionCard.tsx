import clsx from "clsx";
import type { ReactNode } from "react";
import type { IconType } from "react-icons";

import { Card } from "~/components/atoms/card/Card";

export interface SectionCardProps {
  title: string;
  description?: string;
  icon?: IconType;
  children: ReactNode;
  className?: string;
  tone?: "default" | "danger";
}

/**
 * Seção de conteúdo em card, com cabeçalho padronizado.
 *
 * Reutilizada por formulários e blocos informativos para manter a mesma
 * hierarquia visual em diferentes telas.
 */
export function SectionCard({
  title,
  description,
  icon: Icon,
  children,
  className,
  tone = "default",
}: SectionCardProps) {
  return (
    <Card className={className}>
      <section className="flex min-w-0 flex-col gap-6">
        <header className="flex items-center gap-4">
          {Icon && (
            <div
              className={clsx(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                tone === "danger" ? "bg-red-600" : "bg-main",
              )}
            >
              <Icon size={24} className="text-white" />
            </div>
          )}

          <div className="flex min-w-0 flex-col gap-1">
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>

            {description && (
              <p className="text-sm text-slate-500">{description}</p>
            )}
          </div>
        </header>

        <hr className="border-slate-200" />

        {children}
      </section>
    </Card>
  );
}
