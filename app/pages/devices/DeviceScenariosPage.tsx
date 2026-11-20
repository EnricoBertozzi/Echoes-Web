import { useCallback, useState } from "react";
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

  const points = config?.points ?? [];
  const isActive = device?.status === "ACTIVE";
  const anyPointWithoutScenarios = points.some(
    (point) => (scenariosByPoint.get(point.pointId) ?? []).length === 0,
  );
  const canCreatePreset =
    isActive && points.length > 0 && !anyPointWithoutScenarios && !creating;

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
          <Card>
            <h2 className="text-2xl font-bold text-slate-900">Dispositivo</h2>

            <div className="flex flex-wrap gap-x-8 gap-y-2 text-lg text-slate-600">
              <p className="font-mono text-sm text-slate-500">
                {device.hardwareId}
              </p>
              <p>
                Status:{" "}
                <span className={deviceStatusTextStyles[device.status]}>
                  {deviceStatusLabels[device.status]}
                </span>
              </p>
              <p>Animal: {device.animalName || "Sem animal"}</p>
              <p>
                Turma: {device.classroomId ? "Turma vinculada" : "Sem turma"}
              </p>
            </div>

            <div aria-live="polite" className="flex flex-col gap-3">
              {!device.animalId && (
                <Alert
                  type="muted"
                  message="Este dispositivo ainda não tem animal. Peça ao administrador para associar um animal antes de configurar os cenários."
                />
              )}

              {device.animalId && device.status !== "ACTIVE" && (
                <Alert
                  type="muted"
                  message="Dispositivo inativo ou pendente: você pode escolher cenários, mas ele só toca áudio quando estiver ativo. Casos clínicos exigem dispositivo ativo."
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
                      scenarios={scenariosByPoint.get(point.pointId) ?? []}
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
                    Casos clínicos
                  </h2>

                  <div className="flex flex-wrap items-center gap-3">
                    {createReason && (
                      <span className="text-sm text-slate-500">
                        {createReason}
                      </span>
                    )}

                    <div className="w-full sm:w-56">
                      <Button
                        type="button"
                        label="Novo caso clínico"
                        disabled={!canCreatePreset}
                        onClick={() => setShowModal(true)}
                      />
                    </div>
                  </div>
                </div>

                {presets.length === 0 ? (
                  <p className="py-8 text-center text-slate-500">
                    Nenhum caso clínico cadastrado para este animal.
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
        points={points}
        scenariosByPoint={scenariosByPoint}
        busy={creating}
        onClose={() => setShowModal(false)}
        onSubmit={createPreset}
      />
    </Main>
  );
}
