
import { SelectInput } from "~/components/atoms/input/SelectInput";

import type { Institution } from "~/types/Institution";

import type { AuditStatus } from "~/types/audit";

import {
  actionOptions,
  entityOptions,
  statusLabels,
} from "~/utils/auditLabels";

export interface AuditFiltersProps {
  isAdmin: boolean;
  institutions: Institution[];

  institutionFilter: string;
  entityFilter: string;
  actionFilter: string;
  statusFilter: "all" | AuditStatus;

  onInstitutionChange: (value: string) => void;
  onEntityChange: (value: string) => void;
  onActionChange: (value: string) => void;
  onStatusChange: (
    value: "all" | AuditStatus,
  ) => void;
}

const entitySelectOptions = new Map<string, string>(
  entityOptions.map(
    ({ value, label }): [string, string] => [value, label],
  ),
);

const actionSelectOptions = new Map<string, string>(
  actionOptions.map(
    ({ value, label }): [string, string] => [value, label],
  ),
);

const statusSelectOptions = new Map<string, string>([
  ["SUCCESS", statusLabels.SUCCESS],
  ["FAILED", "Somente falhas"],
]);

function selectedValue(value: string): string {
  return value === "all" ? "" : value;
}

function filterValue(value: string): string {
  return value === "" ? "all" : value;
}

export function AuditFilters({
  isAdmin,
  institutions,
  institutionFilter,
  entityFilter,
  actionFilter,
  statusFilter,
  onInstitutionChange,
  onEntityChange,
  onActionChange,
  onStatusChange,
}: AuditFiltersProps) {
  const institutionOptions = new Map<string, string>(
    institutions.map(
      (institution): [string, string] => [
        institution.id,
        institution.name,
      ],
    ),
  );

  return (
    <section
      aria-label="Filtros de auditoria"
      className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
    >
      {isAdmin && (
        <div>
          <label
            htmlFor="audit-institution"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Instituição
          </label>

          <SelectInput
            id="audit-institution"
            name="institutionId"
            placeholder="Todas as instituições"
            disablePlaceholder={false}
            options={institutionOptions}
            value={selectedValue(institutionFilter)}
            onChange={(event) =>
              onInstitutionChange(
                filterValue(event.target.value),
              )
            }
          />
        </div>
      )}

      <div>
        <label
          htmlFor="audit-entity"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Entidade
        </label>

        <SelectInput
          id="audit-entity"
          name="entity"
          placeholder="Todas as entidades"
          disablePlaceholder={false}
          options={entitySelectOptions}
          value={selectedValue(entityFilter)}
          onChange={(event) =>
            onEntityChange(filterValue(event.target.value))
          }
        />
      </div>

      <div>
        <label
          htmlFor="audit-action"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Ação
        </label>

        <SelectInput
          id="audit-action"
          name="action"
          placeholder="Todas as ações"
          disablePlaceholder={false}
          options={actionSelectOptions}
          value={selectedValue(actionFilter)}
          onChange={(event) =>
            onActionChange(filterValue(event.target.value))
          }
        />
      </div>

      <div>
        <label
          htmlFor="audit-status"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Resultado
        </label>

        <SelectInput
          id="audit-status"
          name="status"
          placeholder="Todos"
          disablePlaceholder={false}
          options={statusSelectOptions}
          value={selectedValue(statusFilter)}
          onChange={(event) =>
            onStatusChange(
              filterValue(event.target.value) as
                | "all"
                | AuditStatus,
            )
          }
        />
      </div>
    </section>
  );
}

