import { useEffect, useState } from "react";
import { findPendingInvitations } from "~/api/users";
import type { ApiRole, PendingInvitation } from "~/types/user";

export interface PendingInvitationsListProps {
  institutionId?: string;
  // Filtra por papel depois de buscar (ex.: a página de admins mostra só ADMIN)
  roles?: ApiRole[];
  // Mudar este valor força uma nova busca (ex.: depois de convidar alguém)
  refreshKey?: number;
}

const roleLabels: Record<ApiRole, string> = {
  ADMIN: "Admin",
  MANAGER: "Gestor",
  TEACHER: "Professor",
  STUDENT: "Aluno",
};

function formatRemaining(expiresAt: string, now: number): string {
  const ms = Date.parse(expiresAt) - now;
  if (ms <= 0) return "expirado";

  const minutes = Math.floor(ms / 60_000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} dia(s) e ${hours % 24} h`;
  if (hours > 0) return `${hours} h e ${minutes % 60} min`;
  return `${Math.max(minutes, 1)} min`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function PendingInvitationsList({
  institutionId,
  roles,
  refreshKey = 0,
}: PendingInvitationsListProps) {
  const [invitations, setInvitations] = useState<PendingInvitation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    findPendingInvitations(institutionId)
      .then((data) => {
        if (active) setInvitations(data);
      })
      .catch(() => {
        if (active) setError("Não foi possível buscar os convites pendentes");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [institutionId, refreshKey]);

  // Atualiza o tempo restante a cada minuto
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(timer);
  }, []);

  const visible = roles
    ? invitations.filter((inv) => roles.includes(inv.role))
    : invitations;

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (loading && invitations.length === 0) {
    return <p className="text-sm text-stone-500">Carregando convites...</p>;
  }

  if (visible.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="pending-invitations-title" className="space-y-3">
      <h2
        id="pending-invitations-title"
        className="text-lg font-semibold text-slate-700"
      >
        Convites pendentes ({visible.length})
      </h2>

      <ul className="grid gap-3 md:grid-cols-2">
        {visible.map((inv) => (
          <li
            key={inv.email}
            className="rounded-xl border border-amber-300 bg-amber-50 p-4"
          >
            <p className="font-medium text-slate-800">{inv.name}</p>
            <p className="text-sm text-slate-600">{inv.email}</p>
            <p className="mt-1 text-xs text-slate-500">
              {roleLabels[inv.role]} · convidado em {formatDate(inv.invitedAt)}
            </p>
            <p className="text-xs font-medium text-amber-800">
              Convite expira em {formatRemaining(inv.expiresAt, now)} (
              {formatDate(inv.expiresAt)})
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
