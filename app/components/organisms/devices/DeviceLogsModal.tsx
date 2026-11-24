import { Modal } from "~/components/atoms/modal/Modal";
import { ModalButton } from "~/components/atoms/modal/ModalButton";
import { SelectInput } from "~/components/atoms/input/SelectInput";
import { Alert } from "~/components/atoms/page/Alert";
import { useDeviceLogs } from "~/hooks/devices/useDeviceLogs";
import type { DeviceLogCategory, DeviceLogLevel } from "~/types/deviceLog";
import {
  deviceLogCategoryLabels,
  deviceLogLevelLabels,
  deviceLogLevelStyles,
  formatDeviceLogTime,
} from "~/utils/deviceLogUi";

interface DeviceLogsModalProps {
  deviceId: string;
  deviceName: string;
  isOpen: boolean;
  onClose: () => void;
}

const levelOptions = new Map<string, string>([
  ["WARN", "Avisos e erros"],
  ["ERROR", "Somente erros"],
  ["INFO", "Info, avisos e erros"],
  ["DEBUG", "Tudo (depuração)"],
]);

const categoryOptions = new Map<string, string>(
  Object.entries(deviceLogCategoryLabels),
);

/**
 * Logs recentes do dispositivo (retenção de 7 dias). Cada linha traz uma
 * explicação curta da causa provável, escrita pelo próprio firmware.
 */
export function DeviceLogsModal({
  deviceId,
  deviceName,
  isOpen,
  onClose,
}: DeviceLogsModalProps) {
  const {
    logs,
    loading,
    error,
    page,
    totalPages,
    totalElements,
    minLevel,
    category,
    autoRefresh,
    setAutoRefresh,
    filterByLevel,
    filterByCategory,
    refetch,
    nextPage,
    prevPage,
  } = useDeviceLogs(deviceId, isOpen);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="w-[min(1000px,95vw)] max-h-[90vh] overflow-y-auto"
    >
      <h2 className="text-2xl font-bold text-slate-900">Logs do dispositivo</h2>
      <p className="mt-1 text-slate-600">
        {deviceName} • guardados por 7 dias
      </p>

      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="w-full md:w-64">
          <SelectInput
            id={`log-level-${deviceId}`}
            name="logLevel"
            placeholder="Todos os níveis"
            options={levelOptions}
            value={minLevel}
            disablePlaceholder={false}
            onChange={(e) =>
              filterByLevel(e.target.value as DeviceLogLevel | "")
            }
          />
        </div>

        <div className="w-full md:w-56">
          <SelectInput
            id={`log-category-${deviceId}`}
            name="logCategory"
            placeholder="Todas as categorias"
            options={categoryOptions}
            value={category}
            disablePlaceholder={false}
            onChange={(e) =>
              filterByCategory(e.target.value as DeviceLogCategory | "")
            }
          />
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700 md:ml-auto">
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
          />
          Atualizar sozinho (15 s)
        </label>

        <ModalButton label="Atualizar" onAction={refetch} disabled={loading} />
      </div>

      {error && (
        <div className="mt-4">
          <Alert message={error} type="error" />
        </div>
      )}

      <div className="mt-4">
        {loading && logs.length === 0 ? (
          <p className="py-10 text-center text-slate-500">Carregando logs...</p>
        ) : !error && logs.length === 0 ? (
          <p className="py-10 text-center text-slate-500">
            Nenhum log neste filtro. O dispositivo envia os logs a cada ~30 s
            quando está online.
          </p>
        ) : (
          <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200">
            {logs.map((log) => (
              <li key={log.id} className="flex flex-col gap-1 px-4 py-3">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-bold ${deviceLogLevelStyles[log.level]}`}
                  >
                    {deviceLogLevelLabels[log.level]}
                  </span>
                  <span className="text-slate-500">
                    {formatDeviceLogTime(log.occurredAt)}
                  </span>
                  <span className="text-slate-700">
                    {deviceLogCategoryLabels[log.category]}
                  </span>
                  <span className="font-mono text-xs text-slate-500">
                    {log.code}
                  </span>
                  {log.occurrences > 1 && (
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                      {log.occurrences}x
                    </span>
                  )}
                </div>
                <p className="break-words text-slate-900">{log.message}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <span className="text-sm text-slate-500">
          {totalElements} registro(s)
        </span>

        <div className="flex items-center gap-3">
          <ModalButton
            label="Anterior"
            onAction={prevPage}
            disabled={page === 0 || loading}
          />
          <span className="text-sm text-slate-600">
            {totalPages === 0 ? 0 : page + 1} / {totalPages}
          </span>
          <ModalButton
            label="Próxima"
            onAction={nextPage}
            disabled={page + 1 >= totalPages || loading}
          />
        </div>
      </div>
    </Modal>
  );
}
