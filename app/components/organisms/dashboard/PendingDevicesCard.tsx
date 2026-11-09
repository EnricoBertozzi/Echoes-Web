import { useState } from "react";
import { Button } from "~/components/atoms/Button";
import { TableHeadColumn } from "~/components/atoms/TableHeadColumn";
import { Card } from "~/components/atoms/card/Card";
import { Alert } from "~/components/atoms/page/Alert";
import { SelectInput } from "~/components/atoms/input/SelectInput";
import type { DeviceInfo } from "~/types/device";
import type { Institution } from "~/types/Institution";
import { formatDateTime } from "~/utils/dashboardFormat";

export interface PendingDevicesCardProps {
  devices: DeviceInfo[];
  institutions: Institution[];
  loading: boolean;
  error: string | null;
  approvingId: string | null;
  onApprove: (deviceId: string, institutionId: string) => void;
}

/** Fila de aprovação: o admin escolhe a instituição e aprova o ESP. */
export function PendingDevicesCard({
  devices,
  institutions,
  loading,
  error,
  approvingId,
  onApprove,
}: PendingDevicesCardProps) {
  const [selected, setSelected] = useState<Record<string, string>>({});

  const options = new Map<string, string>(
    institutions
      .filter((institution) => institution.active)
      .map((institution) => [institution.id, institution.name]),
  );

  return (
    <Card>
      <header className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-slate-900">
          Aguardando aprovação
        </h2>
        <p className="text-slate-500">
          ESPs que se registraram sozinhos. Escolha a instituição para liberar.
        </p>
      </header>

      {error && <Alert message={error} type="error" />}

      {loading && devices.length === 0 ? (
        <p className="text-slate-500">Carregando...</p>
      ) : devices.length === 0 ? (
        <Alert message="Nenhum dispositivo aguardando aprovação." type="muted" />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-3xl text-left">
            <thead className="bg-main text-white">
              <tr>
                <TableHeadColumn className="rounded-tl-md">
                  Identificador
                </TableHeadColumn>
                <TableHeadColumn>Nome enviado</TableHeadColumn>
                <TableHeadColumn>Registrado</TableHeadColumn>
                <TableHeadColumn>Instituição</TableHeadColumn>
                <TableHeadColumn className="rounded-tr-md" />
              </tr>
            </thead>
            <tbody>
              {devices.map((device) => {
                const institutionId = selected[device.id] ?? "";
                const approving = approvingId === device.id;

                return (
                  <tr
                    key={device.id}
                    className="border-b border-gray-800/20 text-black"
                  >
                    <td className="px-6 py-3 font-mono text-sm">
                      {device.hardwareId}
                    </td>
                    <td className="px-6 py-3">{device.name}</td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      {formatDateTime(device.createdAt)}
                    </td>
                    <td className="min-w-56 px-6 py-3">
                      <SelectInput
                        id={`institution-${device.id}`}
                        name={`institution-${device.id}`}
                        placeholder="Escolha a instituição"
                        options={options}
                        value={institutionId}
                        onChange={(event) =>
                          setSelected((current) => ({
                            ...current,
                            [device.id]: event.target.value,
                          }))
                        }
                      />
                    </td>
                    <td className="w-32 px-6 py-3">
                      <Button
                        label={approving ? "Aprovando..." : "Aprovar"}
                        disabled={!institutionId || approving}
                        onClick={() => onApprove(device.id, institutionId)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
