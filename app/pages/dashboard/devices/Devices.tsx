import { useState } from "react";
import { FaDog } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { Button } from "~/components/atoms/Button";
import { SelectInput } from "~/components/atoms/input/SelectInput";
import { ModalTextField } from "~/components/atoms/modal/ModalTextField";
import { PageTitle } from "~/components/atoms/PageTitle";
import { Alert } from "~/components/atoms/page/Alert";
import { Main } from "~/components/atoms/page/Main";
import { SearchBar } from "~/components/atoms/SearchBar";
import { useAnimalOptions } from "~/hooks/useAnimalOptions";
import { useInstitutionOptions } from "~/hooks/dashboard/useInstitutionOptions";
import { useDevices } from "~/hooks/useDevices";
import type {
  DeviceInfo,
  DeviceStatus,
  DeviceUpdateRequest,
} from "~/types/device";

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
  const animals = useAnimalOptions(true);
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
    update,
  } = useDevices();

  const institutionOptions = new Map<string, string | number>();
  for (const institution of institutions) {
    institutionOptions.set(institution.id, institution.name);
  }
  for (const device of devices) {
    if (device.institutionId) {
      institutionOptions.set(
        device.institutionId,
        device.institutionName ?? "Instituição sem nome",
      );
    }
  }

  const approvalInstitutionOptions = new Map<string, string | number>();
  for (const institution of institutions) {
    if (institution.active) {
      approvalInstitutionOptions.set(institution.id, institution.name);
    }
  }

  const animalOptions = new Map<string, string | number>();
  for (const animal of animals) {
    animalOptions.set(animal.id, animal.name);
  }
  for (const device of devices) {
    if (device.animalId) {
      animalOptions.set(device.animalId, device.animalName ?? "Animal sem nome");
    }
  }

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
                  institutionOptions={institutionOptions}
                  approvalInstitutionOptions={approvalInstitutionOptions}
                  animalOptions={animalOptions}
                  busy={actingId === device.id}
                  onApprove={approve}
                  onToggle={toggleStatus}
                  onUpdate={update}
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
  institutionOptions: Map<string, string | number>;
  approvalInstitutionOptions: Map<string, string | number>;
  animalOptions: Map<string, string | number>;
  busy: boolean;
  onApprove: (deviceId: string, institutionId: string) => void;
  onToggle: (device: DeviceInfo) => void;
  onUpdate: (deviceId: string, data: DeviceUpdateRequest) => Promise<boolean>;
}

function DeviceCard({
  device,
  institutionOptions,
  approvalInstitutionOptions,
  animalOptions,
  busy,
  onApprove,
  onToggle,
  onUpdate,
}: DeviceCardProps) {
  const [editing, setEditing] = useState(false);
  const [approvalInstitutionId, setApprovalInstitutionId] = useState("");
  const [institutionId, setInstitutionId] = useState("");
  const [name, setName] = useState(device.name ?? "");
  const [animalId, setAnimalId] = useState(device.animalId ?? "");

  const trimmedName = name.trim();
  const nameChanged = trimmedName !== (device.name ?? "");
  const nameError = nameChanged && trimmedName === "";

  function startEditing() {
    setName(device.name ?? "");
    setInstitutionId(device.institutionId ?? "");
    setAnimalId(device.animalId ?? "");
    setEditing(true);
  }

  async function handleEditSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (nameError) return;

    const data: DeviceUpdateRequest = {};

    if (nameChanged) data.name = trimmedName;

    if (
      device.status !== "PENDING" &&
      institutionId !== "" &&
      institutionId !== (device.institutionId ?? "")
    ) {
      data.institutionId = institutionId;
    }

    if (animalId !== "" && animalId !== (device.animalId ?? "")) {
      data.animalId = animalId;
    }

    if (Object.keys(data).length === 0) {
      setEditing(false);
      return;
    }

    const updated = await onUpdate(device.id, data);
    if (updated) setEditing(false);
  }

  return (
    <article className="flex w-full flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm sm:w-80">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-main">
          <FaDog size={28} className="text-white" />
        </div>

        {!editing && (
          <button
            type="button"
            onClick={startEditing}
            disabled={busy}
            className="cursor-pointer text-slate-500 transition-colors hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Editar dispositivo"
            title="Editar dispositivo"
          >
            <FiEdit size={22} />
          </button>
        )}
      </div>

      {editing ? (
        <form className="flex flex-col gap-4" onSubmit={handleEditSubmit}>
          <div className="flex flex-col gap-2">
            <ModalTextField
              id={`device-name-${device.id}`}
              label="Nome"
              value={name}
              onChange={setName}
            />
            {nameError && (
              <span className="text-sm text-red-500">
                O nome não pode ficar vazio.
              </span>
            )}
          </div>

          {device.status !== "PENDING" ? (
            <div className="flex flex-col gap-2">
              <label
                htmlFor={`device-institution-${device.id}`}
                className="text-slate-900"
              >
                Instituição
              </label>
              <SelectInput
                id={`device-institution-${device.id}`}
                name={`device-institution-${device.id}`}
                placeholder="Escolha a instituição"
                options={institutionOptions}
                value={institutionId}
                onChange={(event) => setInstitutionId(event.target.value)}
              />
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              A instituição é definida no momento da aprovação.
            </p>
          )}

          <div className="flex flex-col gap-2">
            <label
              htmlFor={`device-animal-${device.id}`}
              className="text-slate-900"
            >
              Animal
            </label>
            <SelectInput
              id={`device-animal-${device.id}`}
              name={`device-animal-${device.id}`}
              placeholder={
                device.animalId ? "Selecione outro animal" : "Sem animal"
              }
              options={animalOptions}
              value={animalId}
              onChange={(event) => setAnimalId(event.target.value)}
              disablePlaceholder={Boolean(device.animalId)}
            />
            {device.animalId && (
              <span className="text-sm text-slate-500">
                O animal associado não pode ser removido.
              </span>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setEditing(false)}
              disabled={busy}
              className="flex-1 cursor-pointer rounded bg-stone-300 px-4 py-3 text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={busy || nameError}
              className="flex-1 cursor-pointer rounded bg-main px-4 py-3 text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      ) : (
        <>
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
                  options={approvalInstitutionOptions}
                  value={approvalInstitutionId}
                  onChange={(event) =>
                    setApprovalInstitutionId(event.target.value)
                  }
                />
                <Button
                  type="button"
                  label={busy ? "Aprovando..." : "Aprovar"}
                  disabled={!approvalInstitutionId || busy}
                  onClick={() => onApprove(device.id, approvalInstitutionId)}
                />
              </>
            ) : (
              <Button
                type="button"
                label={
                  device.status === "ACTIVE"
                    ? busy
                      ? "Desativando..."
                      : "Desativar"
                    : busy
                      ? "Ativando..."
                      : "Ativar"
                }
                disabled={busy}
                onClick={() => onToggle(device)}
              />
            )}
          </div>
        </>
      )}
    </article>
  );
}
