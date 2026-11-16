
import { SelectInput } from "~/components/atoms/input/SelectInput";

import type { Institution } from "~/types/Institution";

import {
  AUDIT_ACTION_LABELS,
  AUDIT_ENTITY_LABELS,
  AUDIT_STATUS_LABELS,
  type AuditStatus,
} from "~/types/audit";

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

const entityOptions = new Map<string, string>([
  ["all", "Todas as entidades"],
  ...Object.entries(AUDIT_ENTITY_LABELS),
]);

const actionOptions = new Map<string, string>([
  ["all", "Todas as ações"],
  ...Object.entries(AUDIT_ACTION_LABELS),
]);

const statusOptions = new Map<string, string>([
  ["all", "Todos os resultados"],
  ["SUCCESS", AUDIT_STATUS_LABELS.SUCCESS],
  ["FAILED", AUDIT_STATUS_LABELS.FAILED],
]);

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
  const institutionOptions = new Map<string, string>([
    ["all", "Todas as instituições"],

    ...institutions.map(
      (institution): [string, string] => [
        institution.id,
        institution.name,
      ],
    ),
  ]);

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
            placeholder="Selecione a instituição"
            options={institutionOptions}
            value={institutionFilter}
            onChange={(event) =>
              onInstitutionChange(event.target.value)
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
          placeholder="Selecione a entidade"
          options={entityOptions}
          value={entityFilter}
          onChange={(event) =>
            onEntityChange(event.target.value)
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
          placeholder="Selecione a ação"
          options={actionOptions}
          value={actionFilter}
          onChange={(event) =>
            onActionChange(event.target.value)
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
          placeholder="Selecione o resultado"
          options={statusOptions}
          value={statusFilter}
          onChange={(event) =>
            onStatusChange(
              event.target.value as "all" | AuditStatus,
            )
          }
        />
      </div>
    </section>
  );
}

