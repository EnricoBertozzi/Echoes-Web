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

  const rows = devices.map((device) => ({
    device,
    registeredAt: formatDateTime(device.createdAt),
    institutionId: selected[device.id] ?? "",
  }));

  function renderInstitutionSelect(deviceId: string, institutionId: string, id: string) {
    return (
      <SelectInput
        id={id}
        name={id}
        placeholder="Escolha a instituição"
        options={options}
        value={institutionId}
        onChange={(event) =>
          setSelected((current) => ({
            ...current,
            [deviceId]: event.target.value,
          }))
        }
      />
    );
  }

  function renderApproveButton(deviceId: string, institutionId: string) {
    const approving = approvingId === deviceId;

    return (
      <Button
        type="button"
        label={approving ? "Aprovando..." : "Aprovar"}
        disabled={!institutionId || approving}
        onClick={() => onApprove(deviceId, institutionId)}
      />
    );
  }

  return (
    <Card className="max-lg:p-4">
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
        <>
          <ul className="divide-y divide-slate-200 lg:hidden">
            {rows.map(({ device, registeredAt, institutionId }) => {
              const selectId = `mobile-institution-${device.id}`;

              return (
                <li key={device.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0">
                  <dl className="grid gap-3 text-sm text-slate-900 wrap-anywhere sm:grid-cols-3">
                    <div>
                      <dt className="font-semibold">Identificador</dt>
                      <dd className="font-mono">{device.hardwareId}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold">Nome enviado</dt>
                      <dd>{device.name}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold">Registrado</dt>
                      <dd>{registeredAt}</dd>
                    </div>
                  </dl>
                  <div className="flex flex-col gap-1">
                    <label htmlFor={selectId} className="text-sm font-semibold text-slate-900">
                      Instituição
                    </label>
                    {renderInstitutionSelect(device.id, institutionId, selectId)}
                  </div>
                  {renderApproveButton(device.id, institutionId)}
                </li>
              );
            })}
          </ul>

          <div className="hidden overflow-x-auto lg:block">
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
                {rows.map(({ device, registeredAt, institutionId }) => (
                  <tr
                    key={device.id}
                    className="border-b border-gray-800/20 text-black"
                  >
                    <td className="px-6 py-3 font-mono text-sm">
                      {device.hardwareId}
                    </td>
                    <td className="px-6 py-3">{device.name}</td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      {registeredAt}
                    </td>
                    <td className="min-w-56 px-6 py-3">
                      <label htmlFor={`institution-${device.id}`} className="sr-only">
                        Instituição
                      </label>
                      {renderInstitutionSelect(
                        device.id,
                        institutionId,
                        `institution-${device.id}`,
                      )}
                    </td>
                    <td className="w-32 px-6 py-3">
                      {renderApproveButton(device.id, institutionId)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Card>
  );
}
