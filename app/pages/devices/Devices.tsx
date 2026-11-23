import { useState } from "react";
import type { FormEvent } from "react";

import { SelectInput } from "~/components/atoms/input/SelectInput";
import { PageTitle } from "~/components/atoms/PageTitle";
import { Alert } from "~/components/atoms/page/Alert";
import { Main } from "~/components/atoms/page/Main";
import { SearchBar } from "~/components/atoms/SearchBar";
import { PaginationSelector } from "~/components/atoms/page/PaginationSelector";
import { DeviceCard } from "~/components/organisms/DeviceCard";

import { useClassroomLabels } from "~/hooks/classrooms/useClassroomLabels";
import { useAnimalOptions } from "~/hooks/useAnimalOptions";
import { useInstitutionOptions } from "~/hooks/dashboard/useInstitutionOptions";
import { useDevices } from "~/hooks/useDevices";

import type { DeviceStatus } from "~/types/device";
import { useAuth } from "~/context/AuthContext";

export default function Devices() {
  const [search, setSearch] = useState("");

  const { user } = useAuth();
  let institutions = useInstitutionOptions(false);
  let animals = useAnimalOptions(false);

  if (user?.role === "ADMIN") {
    institutions = useInstitutionOptions(true);
    animals = useAnimalOptions(true);
  }

  const {
    devices,
    loading,
    error,
    actingId,
    page,
    size,
    totalPages,
    totalElements,
    nextPage,
    prevPage,
    changeSize,
    status,
    institutionId,
    search: applySearch,
    filterByStatus,
    filterByInstitution,
    approve,
    toggleStatus,
    update,
    remove,
  } = useDevices();

  const classroomLabels = useClassroomLabels(devices);

  const institutionOptions = new Map<string, string>();
  const approvalInstitutionOptions = new Map<string, string>();
  const institutionFilterOptions = new Map<string, string>();
  const animalOptions = new Map<string, string>();

  for (const institution of institutions) {
    institutionOptions.set(institution.id, institution.name);

    institutionFilterOptions.set(institution.id, institution.name);

    if (institution.active) {
      approvalInstitutionOptions.set(institution.id, institution.name);
    }
  }

  // animal desativado não pode ser associado; o já associado entra pelo laço dos dispositivos
  for (const animal of animals) {
    if (animal.active !== false) animalOptions.set(animal.id, animal.name);
  }

  for (const device of devices) {
    if (device.institutionId) {
      institutionOptions.set(
        device.institutionId,
        device.institutionName ?? "Instituição sem nome",
      );
    }

    if (device.animalId) {
      animalOptions.set(
        device.animalId,
        device.animalName ?? "Animal sem nome",
      );
    }
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    applySearch(search.trim());
  }

  const isAdmin = user?.role === "ADMIN";

  const statusOptions = new Map<string, string>([
    ["ACTIVE", "Ativo"],
    ["INACTIVE", "Inativo"],
  ]);

  if (isAdmin) {
    statusOptions.set("PENDING", "Pendente");
  }

  return (
    <Main>
      <PageTitle
        title="Dispositivos"
        description="Dispositivos cadastrados no Echoes."
      />

      <div className="flex w-full flex-col gap-4 xl:flex-row xl:items-center">
        <form className="w-full min-w-0 xl:flex-1" onSubmit={handleSearch}>
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Buscar dispositivo"
          />
        </form>

        {user?.role === "ADMIN" && (
          <div className="w-full xl:w-64">
            <SelectInput
              id="institutionFilter"
              name="institutionFilter"
              placeholder="Todas as instituições"
              options={institutionFilterOptions}
              value={institutionId}
              disablePlaceholder={false}
              onChange={(event) => filterByInstitution(event.target.value)}
            />
          </div>
        )}

        <div className="w-full xl:w-48">
          <SelectInput
            id="statusFilter"
            name="statusFilter"
            placeholder="Todos os status"
            options={statusOptions}
            value={status}
            disablePlaceholder={false}
            onChange={(event) =>
              filterByStatus(event.target.value as DeviceStatus | "")
            }
          />
        </div>
      </div>

      {!loading && !error && (
        <p className="text-sm text-slate-500">
          {totalElements} dispositivo(s) encontrado(s)
        </p>
      )}

      {error && <Alert message={error} type="error" />}

      <div className="w-full min-w-0">
        {loading ? (
          <p className="flex min-h-40 w-full items-center justify-center rounded-xl px-4 text-center bg-stone-300 text-xl text-stone-500">
            Carregando dispositivos...
          </p>
        ) : error ? null : devices.length === 0 ? (
          <Alert message="Nenhum dispositivo encontrado." type="muted" />
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 2xl:grid-cols-3">
            {devices.map((device) => (
              <li key={device.id} className="flex min-w-0">
                <DeviceCard
                  device={device}
                  classroomLabels={classroomLabels}
                  institutionOptions={institutionOptions}
                  approvalInstitutionOptions={approvalInstitutionOptions}
                  animalOptions={animalOptions}
                  busy={actingId === device.id}
                  onApprove={approve}
                  onToggle={toggleStatus}
                  onUpdate={update}
                  onDelete={remove}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      {!loading && !error && (
        <div className="mt-auto w-full pt-4">
          <PaginationSelector
            label="Itens por página"
            page={page}
            size={size}
            sizeOptions={[6, 12, 18]}
            totalPages={totalPages}
            nextPage={nextPage}
            prevPage={prevPage}
            onChange={(value) => changeSize(Number(value))}
          />
        </div>
      )}
    </Main>
  );
}
