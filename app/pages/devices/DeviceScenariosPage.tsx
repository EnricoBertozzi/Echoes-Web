import { useCallback, useMemo, useState } from "react";
import { FaDog } from "react-icons/fa";
import { Navigate, useParams, useSearchParams } from "react-router";

import { findClassroomDevices } from "~/api/classroomDesvices";
import { findDeviceById } from "~/api/devices";
import { Button } from "~/components/atoms/Button";
import { PageTitle } from "~/components/atoms/PageTitle";
import { Card } from "~/components/atoms/card/Card";
import { Alert } from "~/components/atoms/page/Alert";
import { Main } from "~/components/atoms/page/Main";
import { ClinicalPresetCard } from "~/components/organisms/devices/ClinicalPresetCard";
import { ClinicalPresetModal } from "~/components/organisms/devices/ClinicalPresetModal";
import { PointScenarioCard } from "~/components/organisms/devices/PointScenarioCard";
import { useAuth } from "~/context/AuthContext";
import { useDeviceScenarios } from "~/hooks/devices/useDeviceScenarios";
import { LoadingPage } from "~/pages/LoadingPage";
import type { DeviceInfo } from "~/types/device";
import type { Scenario } from "~/types/Scenario";
import { deviceStatusLabels, deviceStatusTextStyles } from "~/utils/deviceUi";

export default function DeviceScenariosPage() {
  const { deviceId } = useParams();
  const [searchParams] = useSearchParams();
  const classroomId = searchParams.get("classroomId");
  const { user, loading } = useAuth();

  if (loading) return <LoadingPage />;

  const role = user?.role;
  const isTeacher = role === "TEACHER";
  const allowed = role === "ADMIN" || role === "MANAGER" || isTeacher;

  if (!user || !allowed || !deviceId) {
    return <Navigate to="/forbidden" replace />;
  }

  if (isTeacher && !classroomId) {
    return <Navigate to="/classrooms" replace />;
  }

  return (
    <DeviceScenariosContent
      deviceId={deviceId}
      classroomId={isTeacher ? classroomId : null}
      isTeacher={isTeacher}
    />
  );
}

interface DeviceScenariosContentProps {
  deviceId: string;
  classroomId: string | null;
  isTeacher: boolean;
}

function DeviceScenariosContent({
  deviceId,
  classroomId,
  isTeacher,
}: DeviceScenariosContentProps) {
  const [showModal, setShowModal] = useState(false);

  const loadDevice = useCallback((): Promise<DeviceInfo> => {
    if (isTeacher && classroomId) {
      return findClassroomDevices(classroomId).then((devices) => {
        const found = devices.find((device) => device.id === deviceId);

        if (!found) {
          throw new Error("Dispositivo não encontrado nesta turma.");
        }

        return found;
      });
    }

    return findDeviceById(deviceId);
  }, [classroomId, deviceId, isTeacher]);

  const {
    device,
    config,
    scenariosByPoint,
    presets,
    loading,
    error,
    busyPointId,
    busyPresetId,
    creating,
    selectScenario,
    createPreset,
    activatePreset,
  } = useDeviceScenarios(deviceId, loadDevice);

  const points = useMemo(() => config?.points ?? [], [config]);
  const isActive = device?.status === "ACTIVE";

  // itens desativados no catálogo não entram em novas escolhas
  const activePoints = useMemo(
    () => points.filter((point) => point.active !== false),
    [points],
  );
  const activeScenariosByPoint = useMemo(() => {
    const active = new Map<string, Scenario[]>();

    for (const [pointId, scenarios] of scenariosByPoint) {
      active.set(
        pointId,
        scenarios.filter((scenario) => scenario.active !== false),
      );
    }

    return active;
  }, [scenariosByPoint]);

  const anyPointWithoutScenarios = activePoints.some(
    (point) => (activeScenariosByPoint.get(point.pointId) ?? []).length === 0,
  );
  const canCreatePreset =
    isActive &&
    activePoints.length > 0 &&
    !anyPointWithoutScenarios &&
    !creating;

  const createReason = !isActive
    ? "O dispositivo precisa estar ativo."
    : points.length === 0
      ? "Cadastre pontos de ausculta no animal."
      : anyPointWithoutScenarios
        ? "Cadastre cenários para todos os pontos."
        : "";

  const backPath = isTeacher
    ? `/classrooms/${classroomId}?tab=dispositivos`
    : "/devices";

  return (
    <Main>
      <PageTitle
        title="Cenários do dispositivo"
        description={device?.name || device?.hardwareId || "Dispositivo"}
        backPath={backPath}
      />

      {loading ? (
        <Alert type="muted" message="Carregando configuração..." />
      ) : error || !device || !config ? (
        <Alert
          type="error"
          message={error ?? "Não foi possível carregar o dispositivo."}
        />
      ) : (
        <>
          <Card className="sm:p-6">
            <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 gap-y-4 lg:grid-cols-[auto_minmax(0,1fr)_minmax(0,2fr)] lg:gap-x-6">
              <div className="grid size-14 place-items-center rounded-2xl bg-main sm:size-16">
                <FaDog size={28} className="text-white" aria-hidden="true" />
              </div>

              <div className="min-w-0">
                <h2 className="text-2xl font-bold text-slate-900 wrap-anywhere">
                  {device.name?.trim() || "Dispositivo"}
                </h2>
                <p className="mt-1 font-mono text-sm text-slate-500 wrap-anywhere">
                  {device.hardwareId}
                </p>
              </div>

              <dl className="col-span-2 grid grid-cols-2 gap-x-4 gap-y-3 wrap-anywhere sm:grid-cols-3 lg:col-span-1">
                <div>
                  <dt className="text-sm text-slate-500">Status</dt>
                  <dd className={deviceStatusTextStyles[device.status]}>
                    {deviceStatusLabels[device.status]}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-500">Animal</dt>
                  <dd className="text-slate-900">{device.animalName || "Sem animal"}</dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-500">Turma</dt>
                  <dd className="text-slate-900">
                    {device.classroomId ? "Turma vinculada" : "Sem turma"}
                  </dd>
                </div>
              </dl>
            </div>

            <div aria-live="polite" className="flex flex-col gap-3 empty:hidden">
              {!device.animalId && (
                <Alert
                  type="muted"
                  message="Este dispositivo ainda não tem animal. Peça ao administrador para associar um animal antes de configurar os cenários."
                />
              )}

              {device.animalId && device.status !== "ACTIVE" && (
                <Alert
                  type="muted"
                  message="Dispositivo inativo ou pendente: você pode escolher cenários, mas ele só toca áudio quando estiver ativo. Cenários clínicos exigem dispositivo ativo."
                />
              )}

              {device.animalId && points.length === 0 && (
                <Alert
                  type="muted"
                  message="Este animal ainda não tem pontos de ausculta cadastrados."
                />
              )}
            </div>
          </Card>

          {device.animalId && points.length > 0 && (
            <>
              <Card>
                <h2 className="text-2xl font-bold text-slate-900">
                  Cenário de cada ponto
                </h2>

                <div className="flex flex-col gap-4">
                  {points.map((point) => (
                    <PointScenarioCard
                      key={point.pointId}
                      point={point}
                      scenarios={
                        activeScenariosByPoint.get(point.pointId) ?? []
                      }
                      busy={busyPointId === point.pointId}
                      onApply={(scenarioId) =>
                        selectScenario(point.pointId, scenarioId)
                      }
                    />
                  ))}
                </div>
              </Card>

              <Card>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <h2 className="text-2xl font-bold text-slate-900">
                    Cenários clínicos
                  </h2>

                  <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
                    {createReason && (
                      <span className="text-sm text-slate-500">
                        {createReason}
                      </span>
                    )}

                    <div className="w-full sm:w-56">
                      <Button
                        type="button"
                        label="Novo cenário clínico"
                        disabled={!canCreatePreset}
                        onClick={() => setShowModal(true)}
                      />
                    </div>
                  </div>
                </div>

                {presets.length === 0 ? (
                  <p className="py-8 text-center text-slate-500">
                    Nenhum cenário clínico cadastrado para este animal.
                  </p>
                ) : (
                  <div className="flex flex-col gap-4">
                    {presets.map((preset) => (
                      <ClinicalPresetCard
                        key={preset.id}
                        preset={preset}
                        points={points}
                        scenariosByPoint={scenariosByPoint}
                        canActivate={isActive}
                        busy={busyPresetId === preset.id}
                        onActivate={activatePreset}
                      />
                    ))}
                  </div>
                )}
              </Card>
            </>
          )}
        </>
      )}

      <ClinicalPresetModal
        isOpen={showModal}
        points={activePoints}
        scenariosByPoint={activeScenariosByPoint}
        busy={creating}
        onClose={() => setShowModal(false)}
        onSubmit={createPreset}
      />
    </Main>
  );
}
