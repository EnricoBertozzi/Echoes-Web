import type { ReactNode } from "react";
import type { IconType } from "react-icons";

import { Card } from "~/components/atoms/card/Card";

interface InstitutionFormSectionProps {
  title: string;
  description?: string;
  icon: IconType;
  children: ReactNode;
}

export function InstitutionFormSection({
  title,
  description,
  icon: Icon,
  children,
}: InstitutionFormSectionProps) {
  return (
    <Card>
      <section className="flex min-w-0 flex-col gap-6">
        <header className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-main">
            <Icon size={24} className="text-white" />
          </div>

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
