import { useEffect, type PropsWithChildren } from "react";

import { LoadingPage } from "~/pages/LoadingPage";
import { usePendingTerms } from "~/hooks/terms/usePendingTerms";
import { subscribeToPendingTerms } from "~/utils/termsEvents";
import { TermsAcceptanceScreen } from "./TermsAcceptanceScreen";

/**
 * Portão de termos obrigatórios. Fica dentro das rotas protegidas e troca a
 * aplicação pela tela de aceite enquanto houver pendências. Também reage ao
 * 403 disparado pelo interceptor quando um novo termo é publicado com a sessão
 * já aberta.
 */
export function TermsGate({ children }: PropsWithChildren) {
  const {
    pendingTypes,
    terms,
    loading,
    error,
    acceptingType,
    accept,
    reload,
  } = usePendingTerms();

  useEffect(() => subscribeToPendingTerms(() => reload()), [reload]);

  if (loading) {
    return <LoadingPage />;
  }

  if (pendingTypes.length > 0) {
    return (
      <TermsAcceptanceScreen
        pendingTypes={pendingTypes}
        terms={terms}
        error={error}
        acceptingType={acceptingType}
        onAccept={accept}
        onRetry={reload}
      />
    );
  }

  return <>{children}</>;
}
