import type { TermType } from "~/types/terms";

/**
 * Evento disparado pelo interceptor do Axios quando o backend responde 403
 * informando que existem termos obrigatórios pendentes. O `TermsGate` escuta
 * esse evento para bloquear a aplicação mesmo que a pendência tenha surgido
 * no meio de uma navegação (por exemplo, um novo termo publicado com a sessão
 * já aberta).
 */
export const TERMS_PENDING_EVENT = "echoes:terms-pending";

export type TermsPendingListener = (types: TermType[]) => void;

export function notifyPendingTerms(types: TermType[]): void {
  if (typeof window === "undefined" || types.length === 0) {
    return;
  }

  window.dispatchEvent(
    new CustomEvent<TermType[]>(TERMS_PENDING_EVENT, { detail: types }),
  );
}

export function subscribeToPendingTerms(
  listener: TermsPendingListener,
): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<TermType[]>;
    listener(customEvent.detail ?? []);
  };

  window.addEventListener(TERMS_PENDING_EVENT, handler);

  return () => {
    window.removeEventListener(TERMS_PENDING_EVENT, handler);
  };
}
