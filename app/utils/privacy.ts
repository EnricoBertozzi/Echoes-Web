/**
 * Mascara um e-mail para exibição (minimização, LGPD art. 6º, III).
 *
 * Mesmo formato do `UserUtils.maskEmail` do servidor: mantém a primeira letra e
 * o domínio. Ex.: `joao.silva@umc.br` → `j***@umc.br`; `a@umc.br` → `*@umc.br`.
 */
export function maskEmail(email: string | null | undefined): string {
  if (!email) return "";

  const at = email.indexOf("@");
  if (at < 0) return email;

  const localPart = email.slice(0, at);
  const domain = email.slice(at);

  if (localPart.length <= 1) return `*${domain}`;

  return `${localPart.charAt(0)}***${domain}`;
}
