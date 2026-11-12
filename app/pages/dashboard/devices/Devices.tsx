import { useState } from "react";
import { FaDog } from "react-icons/fa";
import { Button } from "~/components/atoms/Button";
import { SelectInput } from "~/components/atoms/input/SelectInput";
import { PageTitle } from "~/components/atoms/PageTitle";
import { Alert } from "~/components/atoms/page/Alert";
import { Main } from "~/components/atoms/page/Main";
import { SearchBar } from "~/components/atoms/SearchBar";
import { useInstitutionOptions } from "~/hooks/dashboard/useInstitutionOptions";
import { useDevices } from "~/hooks/useDevices";
import type { DeviceInfo, DeviceStatus } from "~/types/device";

const statusLabels: Record<DeviceStatus, string> = {
  PENDING: "Pendente",
  ACTIVE: "Ativo",
  INACTIVE: "Inativo",
};

const statusTextStyles: Record<DeviceStatus, string> = {
  PENDING: "text-amber-700",
  ACTIVE: "text-green-700",
  INACTIVE: "text-red-700",
};

export default function Devices() {
  const [search, setSearch] = useState("");

  const institutions = useInstitutionOptions(true);
  const {
    devices,
    loading,
    error,
    page,
    actingId,
    hasNextPage,
    hasPrevPage,
    search: applySearch,
    nextPage,
    prevPage,
    approve,
    toggleStatus,
  } = useDevices();

  const institutionOptions = new Map<string, string | number>(
    institutions
      .filter((institution) => institution.active)
      .map((institution) => [institution.id, institution.name]),
  );

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    applySearch(search.trim());
  }

  return (
    <Main>
      <PageTitle
        title="Dispositivos"
        description="Dispositivos cadastrados no Echoes."
      />

      <form className="w-full max-w-xl" onSubmit={handleSearch}>
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Buscar dispositivo"
        />
      </form>

      {error && <Alert message={error} type="error" />}

      <div className="min-w-0 w-full">
        {loading ? (
          <p className="flex h-40 w-full items-center justify-center rounded-xl bg-stone-300 text-xl text-stone-500">
            Carregando dispositivos...
          </p>
        ) : devices.length === 0 ? (
          <Alert message="Nenhum dispositivo encontrado." type="muted" />
        ) : (
          <ul className="flex flex-wrap gap-8">
            {devices.map((device) => (
              <li key={device.id} className="flex">
                <DeviceCard
                  device={device}
                  institutions={institutionOptions}
                  busy={actingId === device.id}
                  onApprove={approve}
                  onToggle={toggleStatus}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      {(hasPrevPage || hasNextPage) && (
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={prevPage}
            disabled={!hasPrevPage}
            className="cursor-pointer text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Anterior
          </button>
          <span className="text-slate-600">Página {page + 1}</span>
          <button
            type="button"
            onClick={nextPage}
            disabled={!hasNextPage}
            className="cursor-pointer text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Próxima
          </button>
        </div>
      )}
    </Main>
  );
}

interface DeviceCardProps {
  device: DeviceInfo;
  institutions: Map<string, string | number>;
  busy: boolean;
  onApprove: (deviceId: string, institutionId: string) => void;
  onToggle: (device: DeviceInfo) => void;
}

function DeviceCard({
  device,
  institutions,
  busy,
  onApprove,
  onToggle,
}: DeviceCardProps) {
  const [institutionId, setInstitutionId] = useState("");

  return (
    <article className="flex w-full flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm sm:w-80">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-main">
        <FaDog size={28} className="text-white" />
      </div>

      <div className="flex min-w-0 flex-col gap-1">
        <h2
          className="line-clamp-2 text-xl font-bold text-slate-900"
          title={device.name}
        >
          {device.name || "—"}
        </h2>
        <p
          className="truncate font-mono text-sm text-slate-500"
          title={device.hardwareId}
        >
          {device.hardwareId}
        </p>
      </div>

      <span className="text-lg text-slate-500">
        Status:{" "}
        <span className={statusTextStyles[device.status]}>
          {statusLabels[device.status]}
        </span>
      </span>

      {(device.institutionName || device.animalName) && (
        <dl className="flex flex-col gap-1 text-sm text-slate-600">
          {device.institutionName && (
            <div className="flex items-baseline justify-between gap-3">
              <dt className="shrink-0 font-medium text-slate-700">
                Instituição
              </dt>
              <dd
                className="truncate text-right"
                title={device.institutionName}
              >
                {device.institutionName}
              </dd>
            </div>
          )}
          {device.animalName && (
            <div className="flex items-baseline justify-between gap-3">
              <dt className="shrink-0 font-medium text-slate-700">Animal</dt>
              <dd className="truncate text-right" title={device.animalName}>
                {device.animalName}
              </dd>
            </div>
          )}
        </dl>
      )}

      <div className="mt-auto flex flex-col gap-3 border-t border-slate-100 pt-4">
        {device.status === "PENDING" ? (
          <>
            <SelectInput
              id={`institution-${device.id}`}
              name={`institution-${device.id}`}
              placeholder="Escolha a instituição"
              options={institutions}
              value={institutionId}
              onChange={(event) => setInstitutionId(event.target.value)}
            />
            <Button
              type="button"
              label={busy ? "Aprovando..." : "Aprovar"}
              disabled={!institutionId || busy}
              onClick={() => onApprove(device.id, institutionId)}
            />
          </>
        ) : (
          <Button
            type="button"
            label={
              busy
                ? "Salvando..."
                : device.status === "ACTIVE"
                  ? "Desativar"
                  : "Ativar"
            }
            disabled={busy}
            onClick={() => onToggle(device)}
          />
        )}
      </div>
    </article>
  );
}
