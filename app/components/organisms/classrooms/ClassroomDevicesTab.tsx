import { Link } from "react-router";
import { Button } from "~/components/atoms/Button";
import { Card } from "~/components/atoms/card/Card";
import { Alert } from "~/components/atoms/page/Alert";
import { useClassroomDeviceList } from "~/hooks/classrooms/useClassroomDeviceList";
import { deviceStatusLabels, deviceStatusTextStyles } from "~/utils/deviceUi";

export interface ClassroomDevicesTabProps {
  classroomId: string;
  isTeacher: boolean;
  archived: boolean;
}

/**
 * Lista os dispositivos vinculados à turma e abre a configuração de cenários.
 * O professor informa a turma na URL porque não pode consultar um dispositivo
 * pelo id diretamente.
 */
export function ClassroomDevicesTab({
  classroomId,
  isTeacher,
  archived,
}: ClassroomDevicesTabProps) {
  const { devices, loading, error, refetch } = useClassroomDeviceList(
    classroomId,
    true,
  );

  function scenariosPath(deviceId: string) {
    return isTeacher
      ? `/devices/${deviceId}/scenarios?classroomId=${classroomId}`
      : `/devices/${deviceId}/scenarios`;
  }

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Dispositivos da turma
          </h2>

          <p className="mt-1 text-slate-600">
            {devices.length}{" "}
            {devices.length === 1
              ? "dispositivo vinculado"
              : "dispositivos vinculados"}
            .
          </p>

          {archived && (
            <p className="text-sm text-amber-700">
              Turma arquivada: os dispositivos não tocam áudio.
            </p>
          )}
        </div>

        <div className="w-full sm:w-40">
          <Button
            type="button"
            label="Atualizar"
            variant="muted"
            disabled={loading}
            onClick={refetch}
          />
        </div>
      </div>

      {error && <Alert message={error} type="error" />}

      {loading ? (
        <p className="py-8 text-center text-slate-500">
          Carregando dispositivos...
        </p>
      ) : !error && devices.length === 0 ? (
        <p className="py-8 text-center text-slate-500">
          Nenhum dispositivo vinculado a esta turma.
        </p>
      ) : (
        <ul className="divide-y divide-slate-200">
          {devices.map((device) => (
            <li
              key={device.id}
              className="flex flex-wrap items-start justify-between gap-4 py-5"
            >
              <div className="min-w-0 flex-1">
                <h3 className="break-words text-lg font-bold text-slate-900">
                  {device.name || device.hardwareId}
                </h3>

                <p className="break-all font-mono text-xs text-slate-500">
                  {device.hardwareId}
                </p>

                <p className="mt-1 text-slate-600">
                  Status:{" "}
                  <span className={deviceStatusTextStyles[device.status]}>
                    {deviceStatusLabels[device.status]}
                  </span>
                </p>

                <p className="text-slate-600">
                  Animal: {device.animalName || "Sem animal"}
                </p>

                {device.status === "ACTIVE" && archived && (
                  <p className="text-sm text-amber-700">
                    Não toca áudio: turma arquivada.
                  </p>
                )}
              </div>

              {device.status !== "PENDING" && (
                <div className="w-full sm:w-36">
                  <Link
                    to={scenariosPath(device.id)}
                    className="flex w-full items-center justify-center rounded bg-gray-300 px-4 py-3 text-black"
                  >
                    Cenários
                  </Link>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
