import { useState } from "react";
import { useConfirmation } from "~/context/ConfirmationContext";

import { exportMyData, revokeMyConsent } from "~/api/privacy";
import { logout as endServerSession } from "~/api/auth";
import { Button } from "~/components/atoms/Button";
import { SectionCard } from "~/components/molecules/SectionCard";
import { useAuth } from "~/context/AuthContext";

/**
 * Direitos do titular: exportação dos dados (RF18) e revogação do
 * consentimento (RF17). A revogação encerra a sessão.
 */
export function ProfilePrivacySection() {
  const confirmAction = useConfirmation();
  const { logout } = useAuth();
  const [busy, setBusy] = useState(false);

  async function handleExport() {
    setBusy(true);
    try {
      await exportMyData();
    } finally {
      setBusy(false);
    }
  }

  async function handleRevoke() {
    const confirmed = await confirmAction({
      title: "Revogar consentimento",
      description:
        "Revogar o consentimento encerra sua sessão. Para voltar a usar o Echoes, você precisará aceitar novamente os termos. Deseja continuar?",
      confirmLabel: "Revogar",
      variant: "danger",
    });
    if (!confirmed) return;

    setBusy(true);
    try {
      await revokeMyConsent();
      // encerra a sessão no servidor (cookie é apagado na resposta)
      await endServerSession().catch(() => undefined);
    } finally {
      setBusy(false);
      logout();
    }
  }

  return (
    <SectionCard
      title="Meus dados (LGPD)"
      description="Exporte seus dados ou revogue seu consentimento."
    >
      <p className="text-sm leading-relaxed text-slate-600">
        A exportação gera um arquivo JSON com seu perfil, aceites de termos,
        turmas, materiais enviados e registros de atividade vinculados à sua
        conta.
      </p>

      <div className="flex w-full flex-col gap-3 sm:w-80">
        <Button
          type="button"
          label={busy ? "Aguarde..." : "Baixar meus dados"}
          variant="primary"
          disabled={busy}
          onClick={handleExport}
        />

        <Button
          type="button"
          label="Revogar consentimento"
          variant="danger"
          disabled={busy}
          onClick={handleRevoke}
        />
      </div>
    </SectionCard>
  );
}
