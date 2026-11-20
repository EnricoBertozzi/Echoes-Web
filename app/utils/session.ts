/**
 * Marcador de sessão (S10). O JWT fica num cookie HttpOnly e não é lido por JS.
 * Esta chave guarda só um sinal "há sessão" para decidir se vale restaurar a
 * sessão ao abrir a página, sem fazer requisição anônima à toa.
 */
export const SESSION_HINT_KEY = "echoes_session_hint";

export function hasSessionHint(): boolean {
  return typeof window !== "undefined" && localStorage.getItem(SESSION_HINT_KEY) === "1";
}

export function setSessionHint(active: boolean): void {
  if (typeof window === "undefined") return;
  if (active) {
    localStorage.setItem(SESSION_HINT_KEY, "1");
  } else {
    localStorage.removeItem(SESSION_HINT_KEY);
  }
}
