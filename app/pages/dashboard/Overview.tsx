import { useState } from "react";
import { PageTitle } from "~/components/atoms/PageTitle";
import { Card } from "~/components/atoms/card/Card";
import { KpiCard } from "~/components/atoms/dashboard/KpiCard";
import { PeriodSelector } from "~/components/atoms/dashboard/PeriodSelector";
import { SelectInput } from "~/components/atoms/input/SelectInput";
import { Alert } from "~/components/atoms/page/Alert";
import { Main } from "~/components/atoms/page/Main";
import { DeviceStatusChart } from "~/components/molecules/dashboard/DeviceStatusChart";
import { RankingList } from "~/components/molecules/dashboard/RankingList";
import { UsageChart } from "~/components/molecules/dashboard/UsageChart";
import { PendingDevicesCard } from "~/components/organisms/dashboard/PendingDevicesCard";
import { useAuth } from "~/context/AuthContext";
import { useDashboard } from "~/hooks/dashboard/useDashboard";
import { useInstitutionOptions } from "~/hooks/dashboard/useInstitutionOptions";
import { usePendingDevices } from "~/hooks/dashboard/usePendingDevices";
import type { DashboardPeriod } from "~/types/dashboard";
import {
  formatDateTime,
  formatNumber,
  percentChange,
} from "~/utils/dashboardFormat";

const ALL = "all";

/**
 * Painel. ADMIN: todas as instituições, filtro por instituição e fila de
 * aprovação. MANAGER: sempre a própria instituição (o backend força o escopo).
 */
export default function Overview() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [days, setDays] = useState<DashboardPeriod>(30);
  const [institutionFilter, setInstitutionFilter] = useState(ALL);

  const institutions = useInstitutionOptions(isAdmin);
  const institutionId =
    isAdmin && institutionFilter !== ALL ? institutionFilter : undefined;

  const { devices, usage, rankings, loading, error, refetch } = useDashboard(
    days,
    institutionId,
  );
  const pending = usePendingDevices(isAdmin, refetch);

  const filterOptions = new Map<string, string>([
    [ALL, "Todas as instituições"],
    ...institutions.map((institution): [string, string] => [
      institution.id,
      institution.name,
    ]),
  ]);

  const change = usage ? percentChange(usage.plays, usage.previousPlays) : null;
  const changeText =
    change === null
      ? "Sem período anterior para comparar"
      : `${change > 0 ? "▲" : change < 0 ? "▼" : "■"} ${Math.abs(change)}% em relação ao período anterior`;
  const changeTone =
    change === null || change === 0 ? "muted" : change > 0 ? "good" : "bad";

  return (
    <Main>
      <PageTitle
        title="Painel"
        description={
          isAdmin
            ? "Uso e dispositivos de todas as instituições."
            : "Uso e dispositivos da sua instituição."
        }
      />

      <div className="flex flex-wrap items-center gap-4">
        {isAdmin && (
          <div className="w-72">
            <SelectInput
              id="institution-filter"
              name="institution-filter"
              placeholder="Instituição"
              options={filterOptions}
              value={institutionFilter}
              onChange={(event) => setInstitutionFilter(event.target.value)}
            />
          </div>
        )}
        <PeriodSelector value={days} onChange={setDays} />
      </div>

      {error && <Alert message={error} type="error" />}

      {devices && devices.blockedByInstitution > 0 && (
        <Alert
          type="error"
          message={`${devices.blockedByInstitution} dispositivo(s) ativo(s) não operam porque a instituição está inativa ou foi removida.`}
        />
      )}

      {loading && !usage && (
        <p className="flex h-40 items-center justify-center rounded-xl bg-stone-300 text-xl text-stone-500">
          Carregando painel...
        </p>
      )}

      {usage && devices && rankings && (
        <div
          className={`flex flex-col gap-8 transition-opacity ${loading ? "opacity-60" : ""}`}
        >
          <section
            aria-label="Resumo"
            className="grid grid-cols-2 gap-4 lg:grid-cols-4"
          >
            <KpiCard
              label="Sessões"
              value={formatNumber(usage.plays)}
              detail={changeText}
              tone={changeTone}
            />
            <KpiCard
              label="Dispositivos operando"
              value={formatNumber(devices.operating)}
              detail={`de ${formatNumber(devices.active)} ativos`}
            />
            <KpiCard
              label="Com atividade"
              value={formatNumber(usage.activeDevices)}
              detail={`nos últimos ${days} dias`}
            />
            {isAdmin ? (
              <KpiCard
                label="Aguardando aprovação"
                value={formatNumber(devices.pending)}
                detail={devices.pending > 0 ? "Veja a fila abaixo" : "Fila vazia"}
              />
            ) : (
              <KpiCard
                label="Inativos"
                value={formatNumber(devices.inactive)}
                detail="Bloqueados pelo administrador"
              />
            )}
          </section>

          <div className="grid gap-8 lg:grid-cols-[3fr_2fr]">
            <Card>
              <h2 className="text-2xl font-bold text-slate-900">
                Sessões por dia
              </h2>
              <p className="text-slate-500">
                {formatNumber(usage.plays)} sessões em {days} dias.
              </p>
              <UsageChart days={usage.days} />
            </Card>

            <Card>
              <h2 className="text-2xl font-bold text-slate-900">
                Dispositivos por instituição
              </h2>
              <DeviceStatusChart institutions={devices.institutions} />
            </Card>
          </div>

          {isAdmin && (
            <PendingDevicesCard
              devices={pending.devices}
              institutions={institutions}
              loading={pending.loading}
              error={pending.error}
              approvingId={pending.approvingId}
              onApprove={pending.approve}
            />
          )}

          <div className="grid gap-8 lg:grid-cols-2">
            <Card>
              <h2 className="text-2xl font-bold text-slate-900">
                Cenários mais usados
              </h2>
              <RankingList
                emptyMessage="Nenhuma sessão no período."
                items={rankings.scenarios.map((scenario) => ({
                  id: scenario.scenarioId,
                  label: scenario.name,
                  value: scenario.plays,
                  detail: `${scenario.devices} disp.`,
                }))}
              />
            </Card>

            <Card>
              <h2 className="text-2xl font-bold text-slate-900">
                Dispositivos mais usados
              </h2>
              <RankingList
                emptyMessage="Nenhuma sessão no período."
                items={rankings.devices.map((device) => ({
                  id: device.deviceId,
                  label: device.name,
                  value: device.plays,
                  detail: formatDateTime(device.lastEventAt),
                }))}
              />
            </Card>
          </div>
        </div>
      )}
    </Main>
  );
}
