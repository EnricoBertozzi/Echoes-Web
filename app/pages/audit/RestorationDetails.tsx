import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router";
import {
  executeRestoration,
  getRestoration,
  restorationStatuses,
  restorationTypes,
  reviewRestoration,
  type RestorationDetail,
  type RestorationResult,
  type SkippedMember,
} from "~/api/restorations";
import { Button } from "~/components/atoms/Button";
import { PageTitle } from "~/components/atoms/PageTitle";
import { Card } from "~/components/atoms/card/Card";
import { Main } from "~/components/atoms/page/Main";
import { ConfirmMessageModal } from "~/components/organisms/modal/ConfirmMessageModal";
import { formatAuditTimestamp } from "~/types/audit";

type Action = "request" | "approve" | "execute";

function SkippedMembers({ members }: { members: SkippedMember[] }) {
  if (members.length === 0) return null;
  return (
    <details className="rounded-md border border-slate-200 p-3">
      <summary className="cursor-pointer font-medium text-slate-900">Vínculos ignorados ({members.length})</summary>
      <ul className="mt-3 divide-y divide-slate-200 text-sm text-slate-700">
        {members.map((member) => (
          <li className="grid gap-1 py-2" key={member.membershipId}>
            <span>{member.reason}</span>
            <span className="break-all text-slate-500">ID do vínculo {member.membershipId}</span>
          </li>
        ))}
      </ul>
    </details>
  );
}

export default function RestorationDetails() {
  const { type, id } = useParams();
  const { search } = useLocation();
  const [detail, setDetail] = useState<RestorationDetail>();
  const [result, setResult] = useState<RestorationResult>();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [notice, setNotice] = useState("");
  const [revision, setRevision] = useState(0);
  const [sending, setSending] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const inFlight = useRef(false);
  const reload = () => setRevision((value) => value + 1);

  useEffect(() => {
    setDetail(undefined);
    setResult(undefined);
    setActionError("");
    setNotice("");
  }, [type, id]);

  useEffect(() => {
    let current = true;
    setLoading(true);
    setLoadError("");
    if (!type || !id) {
      setLoadError("Caso de restauração inválido.");
      setLoading(false);
      return;
    }
    void getRestoration(type, id)
      .then((data) => {
        if (current) setDetail(data);
      })
      .catch((failure: unknown) => {
        if (current) setLoadError(failure instanceof Error ? failure.message : "Falha ao carregar o caso.");
      })
      .finally(() => {
        if (current) setLoading(false);
      });
    return () => { current = false; };
  }, [type, id, revision]);

  async function submit(action: Action) {
    if (!detail || inFlight.current) return;
    inFlight.current = true;
    setSending(true);
    setActionError("");
    setNotice("");
    try {
      if (action === "execute") {
        setResult(await executeRestoration(detail.target));
      } else {
        await reviewRestoration(detail.target, action);
        setNotice(action === "request" ? "Solicitação registrada." : "Restauração aprovada.");
      }
    } catch (failure) {
      setActionError(failure instanceof Error ? failure.message : "Não foi possível concluir a operação.");
    } finally {
      setLoading(true);
      reload();
      inFlight.current = false;
      setSending(false);
    }
  }

  const target = detail?.target;
  const isClassroom = target?.type === "CLASSROOM";
  const busy = sending || loading || Boolean(loadError);

  return (
    <Main>
      <PageTitle title={target?.name ?? "Detalhes da restauração"} backPath={`/audit/restorations${search}`}
        description={target ? restorationTypes[target.type] : "Consulte o status e os vínculos do registro excluído."} />
      <Card>
        {loading && <p role="status" className="text-slate-600">Carregando caso…</p>}
        {loadError && (
          <>
            <p role="alert" className="text-red-700">{loadError}</p>
            <Button type="button" className="max-w-48" label="Tentar novamente" onClick={reload} />
          </>
        )}
        {actionError && <p role="alert" className="text-red-700">{actionError}</p>}
        {notice && <p role="status" className="rounded-md bg-emerald-50 p-3 text-emerald-800">{notice}</p>}
        {result && (
          <div className="grid gap-3">
            <p role="status" className="rounded-md bg-emerald-50 p-3 text-emerald-800">
              Restauração concluída. {result.recoveredMembers} {isClassroom ? "vínculos recriados na turma." : "vínculos mantidos na instituição."}
            </p>
            <SkippedMembers members={result.skippedMembers} />
          </div>
        )}
        {detail && target && (
          <>
            <dl className="grid gap-4 border-b border-slate-200 pb-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-slate-600">Status</dt>
                <dd className="font-semibold text-slate-900">{restorationStatuses[target.status]}</dd>
              </div>
              <div>
                <dt className="text-slate-600">Data da exclusão</dt>
                <dd className="font-semibold text-slate-900">{target.deletedAt ? formatAuditTimestamp(target.deletedAt) : "Indisponível"}</dd>
              </div>
              {detail.restoredAt && (
                <div>
                  <dt className="text-slate-600">Data da restauração</dt>
                  <dd className="font-semibold text-slate-900">{formatAuditTimestamp(detail.restoredAt)}</dd>
                </div>
              )}
            </dl>
            {target.status !== "EXECUTED" && !result && (
              <>
                {detail.blockedReason && <p className="rounded-md bg-amber-50 p-3 text-amber-900">{detail.blockedReason}</p>}
                {isClassroom && !target.rosterRecorded ? (
                  <p className="rounded-md bg-amber-50 p-3 text-amber-900">
                    Esta exclusão é anterior ao registro de integrantes. A restauração recuperará somente a turma.
                  </p>
                ) : (!isClassroom || !detail.blockedReason) && (
                  <p className="text-slate-700">
                    {detail.recoverableMembers} {isClassroom ? "vínculos podem ser recriados na turma." : "vínculos existentes ficarão acessíveis com a instituição."}
                  </p>
                )}
                {isClassroom && <p className="text-sm text-slate-600">Os materiais apagados na exclusão não serão recuperados.</p>}
                <SkippedMembers members={detail.skippedMembers} />
                {target.status === "PENDING_APPROVAL" && !detail.canApprove && !detail.blockedReason && (
                  <p className="text-sm text-slate-600">Outro administrador precisa aprovar esta solicitação.</p>
                )}
                {target.status === "AVAILABLE" && (
                  <Button type="button" className="max-w-60" label="Solicitar restauração" disabled={busy}
                    onClick={() => void submit("request")} />
                )}
                {detail.canApprove && (
                  <Button type="button" className="max-w-60" label="Aprovar restauração" disabled={busy}
                    onClick={() => void submit("approve")} />
                )}
                {detail.canExecute && (
                  <Button type="button" className="max-w-60" label="Restaurar registro" disabled={busy}
                    onClick={() => setConfirming(true)} />
                )}
              </>
            )}
            {confirming && (
              <ConfirmMessageModal title="Confirmar restauração" confirmLabel="Restaurar"
                description={`Restaurar ${target.name}? A prévia indica ${detail.recoverableMembers} vínculos. O servidor vai conferir esses vínculos novamente.`}
                onCancel={() => setConfirming(false)}
                onConfirm={() => {
                  setConfirming(false);
                  void submit("execute");
                }} />
            )}
          </>
        )}
      </Card>
    </Main>
  );
}
