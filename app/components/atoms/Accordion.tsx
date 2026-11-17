import { useId, useState } from "react";
import type { ReactNode } from "react";
import { FiChevronDown } from "react-icons/fi";

interface AccordionProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function Accordion({
  title,
  subtitle,
  children,
  defaultOpen = false,
}: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <div className="w-full min-w-0 rounded-xl border border-slate-200">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={`flex w-full min-w-0 cursor-pointer items-center justify-between gap-4 p-4 text-left transition-colors hover:bg-slate-50 ${
          open ? "rounded-t-xl" : "rounded-xl"
        }`}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex min-w-0 flex-col gap-1">
            <span className="wrap-anywhere text-lg font-semibold text-slate-900">
              {title}
            </span>

            {subtitle && (
              <span className="text-base text-slate-500">{subtitle}</span>
            )}
          </div>
        </div>

        <FiChevronDown
          size={22}
          className={`shrink-0 text-slate-500 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        id={contentId}
        hidden={!open}
        className="min-w-0 rounded-b-xl border-t border-slate-200 bg-slate-50 p-3 sm:p-4"
      >
        {children}
      </div>
    </div>
  );
}
