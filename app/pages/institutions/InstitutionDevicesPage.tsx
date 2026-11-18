import { useState } from "react";
import { Navigate, useParams } from "react-router";
import type { ReactNode } from "react";
import { Button } from "~/components/atoms/Button";
import { PageTitle } from "~/components/atoms/PageTitle";
import { Card } from "~/components/atoms/card/Card";
import { Alert } from "~/components/atoms/page/Alert";
import { Main } from "~/components/atoms/page/Main";
import { useAuth } from "~/context/AuthContext";
import { useClassroomDevices } from "~/hooks/classrooms/useClassroomDevices";
import { LoadingPage } from "~/pages/LoadingPage";
import type { DeviceInfo } from "~/types/device";

const statusLabels = {
  ACTIVE: "Ativo",
  INACTIVE: "Inativo",
  PENDING: "Pendente",
};

export default function InstitutionDevicesPage() {
  const { institutionId } = useParams();
  const { user, loading } = useAuth();

  if (loading) return <LoadingPage />;

  if (
    !institutionId ||
    user?.role !== "MANAGER" ||
    user.institutionId !== institutionId
  ) {
    return <Navigate to="/forbidden" replace />;
  }

  return (
    <InstitutionDevicesContent
      key={institutionId}
      institutionId={institutionId}
    />
  );
}

function InstitutionDevicesContent({
  institutionId,
}: {
  institutionId: string;
}) {
  const [search, setSearch] = useState("");
  const data = useClassroomDevices(institutionId);

  function currentClassroomLabel(device: DeviceInfo) {
    if (!device.classroomId) return "Sem turma";

    const classroom = data.classrooms.find(
      (item) => item.id === device.classroomId,
    );

    return classroom
      ? `${classroom.title} • ${classroom.period}`
      : "Vinculado a outra turma";
  }

  return (
    <Main>
      <PageTitle
        title="Dispositivos e turmas"
        description="Organize os dispositivos da instituição por turma."
        backPath={`/institutions/${institutionId}`}
      />

      <div aria-live="polite" className="flex flex-col gap-3">
        {data.message && <Alert type="success" message={data.message} />}

        {data.error && <Alert type="error" message={data.error} />}
      </div>

      <Card>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold text-slate-900">
              Selecione a turma
            </h2>

            <p className="text-sm text-slate-500">
              Cada dispositivo pode pertencer a uma turma por vez.
            </p>
          </div>

          <label
            htmlFor="device-classroom"
            className="text-sm font-medium text-slate-700"
          >
            Turma
          </label>

          <select
            id="device-classroom"
            value={data.classroomId}
            disabled={data.busy || data.classrooms.length === 0}
            onChange={(event) => data.selectClassroom(event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 disabled:opacity-50"
          >
            <option value="" disabled>
              Selecione uma turma
            </option>

            {data.classrooms.map((classroom) => (
              <option key={classroom.id} value={classroom.id}>
                {classroom.title} - {classroom.period}
                {classroom.archived ? " - Arquivada" : ""}
              </option>
            ))}
          </select>

          {data.loadingClassrooms && <p role="status">Carregando turmas...</p>}

          {!data.loadingClassrooms &&
            data.classrooms.length === 0 &&
            !data.error && (
              <p className="text-slate-500">
                Cadastre uma turma antes de atribuir dispositivos.
              </p>
            )}

          {data.classroom?.archived && (
            <Alert
              type="muted"
              message="Turma arquivada: não é possível atribuir novos dispositivos. Os vínculos existentes podem ser removidos."
            />
          )}

          <div className="w-full sm:w-40">
            <Button
              label="Atualizar"
              variant="muted"
              type="button"
              disabled={data.busy}
              onClick={data.refresh}
            />
          </div>
        </div>
      </Card>

      {data.loading ? (
        <p
          role="status"
          className="rounded-xl bg-slate-100 p-8 text-center text-slate-500"
        >
          Carregando dispositivos...
        </p>
      ) : (
        <>
          {data.classroom && (
            <section className="flex flex-col gap-4">
              <h2 className="text-xl font-bold text-slate-900">
                Dispositivos em {data.classroom.title}
              </h2>

              {data.linkedDevices.length === 0 && !data.error && (
                <p className="text-slate-500">
                  Nenhum dispositivo vinculado a esta turma.
                </p>
              )}

              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                {data.linkedDevices.map((device) => (
                  <DeviceAssignmentCard
                    key={device.id}
                    device={device}
                    description={currentClassroomLabel(device)}
                  >
                    <Button
                      label="Remover vínculo"
                      variant="danger"
                      type="button"
                      disabled={data.busy || Boolean(data.error)}
                      onClick={() => data.remove(device)}
                    />
                  </DeviceAssignmentCard>
                ))}
              </div>
            </section>
          )}

          <section className="flex flex-col gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Dispositivos da instituição
              </h2>

              <p className="text-sm text-slate-500">
                Atribua um dispositivo à turma selecionada.
              </p>
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                data.applySearch(search);
              }}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <label htmlFor="device-search" className="sr-only">
                Nome do dispositivo
              </label>

              <input
                id="device-search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar pelo nome do dispositivo"
                disabled={data.busy}
                className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white p-3 text-slate-900"
              />

              <div className="w-full sm:w-32">
                <Button label="Buscar" type="submit" disabled={data.busy} />
              </div>
            </form>

            {data.devices.length === 0 && !data.error && (
              <p className="text-slate-500">Nenhum dispositivo encontrado.</p>
            )}

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              {data.devices.map((device) => {
                const alreadyLinked =
                  Boolean(data.classroomId) &&
                  device.classroomId === data.classroomId;

                const disabled =
                  data.busy ||
                  Boolean(data.error) ||
                  !data.classroom ||
                  data.classroom.archived ||
                  device.status === "PENDING" ||
                  device.institutionId !== institutionId ||
                  alreadyLinked;

                return (
                  <DeviceAssignmentCard
                    key={device.id}
                    device={device}
                    description={currentClassroomLabel(device)}
                  >
                    <Button
                      type="button"
                      label={
                        alreadyLinked
                          ? "Já vinculado"
                          : device.status === "PENDING"
                            ? "Aguardando aprovação"
                            : device.classroomId
                              ? "Transferir para esta turma"
                              : "Atribuir à turma"
                      }
                      disabled={disabled}
                      onClick={() => data.assign(device)}
                    />
                  </DeviceAssignmentCard>
                );
              })}
            </div>

            {data.totalPages > 1 && (
              <div className="flex items-center justify-between gap-4">
                <button
                  type="button"
                  disabled={data.busy || data.page === 0}
                  onClick={() => data.changePage(data.page - 1)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 disabled:opacity-40"
                >
                  Anterior
                </button>

                <span className="text-sm text-slate-600">
                  Página {data.page + 1} de {data.totalPages}
                </span>

                <button
                  type="button"
                  disabled={data.busy || data.page + 1 >= data.totalPages}
                  onClick={() => data.changePage(data.page + 1)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 disabled:opacity-40"
                >
                  Próxima
                </button>
              </div>
            )}
          </section>
        </>
      )}
    </Main>
  );
}

function DeviceAssignmentCard({
  device,
  description,
  children,
}: {
  device: DeviceInfo;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="break-words text-lg font-bold text-slate-900">
            {device.name || device.hardwareId}
          </h3>

          <p className="break-all font-mono text-xs text-slate-500">
            {device.hardwareId}
          </p>
        </div>

        <dl className="flex flex-col gap-2 text-sm">
          <div>
            <dt className="text-slate-500">Situação</dt>
            <dd className="font-medium text-slate-900">
              {statusLabels[device.status]}
            </dd>
          </div>

          <div>
            <dt className="text-slate-500">Animal</dt>
            <dd className="text-slate-900">
              {device.animalName || "Não associado"}
            </dd>
          </div>

          <div>
            <dt className="text-slate-500">Turma atual</dt>
            <dd className="text-slate-900">{description}</dd>
          </div>
        </dl>

        {children}
      </div>
    </Card>
  );
}
