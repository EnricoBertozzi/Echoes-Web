export function maskEmail(email: string | null | undefined): string {
  if (!email) return "";

  const at = email.indexOf("@");
  if (at < 0) return email;

  const localPart = email.slice(0, at);
  const domain = email.slice(at);

  if (localPart.length <= 1) return `*${domain}`;

  return `${localPart.charAt(0)}***${domain}`;
}
