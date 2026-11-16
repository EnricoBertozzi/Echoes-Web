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
import { DeviceCard } from "~/components/organisms/DeviceCard";
import { PaginationSelector } from "~/components/atoms/page/PaginationSelector";

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
      animalOptions.set(
        device.animalId,
        device.animalName ?? "Animal sem nome",
      );
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
