export const WEB_UPLOAD_LIMIT_MB = 50;
const WEB_UPLOAD_LIMIT_BYTES = WEB_UPLOAD_LIMIT_MB * 1024 * 1024;

export function validateUploadSize(file: File | null) {
  if (!file) return true;
  if (file.size === 0) return "O arquivo está vazio.";

  return file.size <= WEB_UPLOAD_LIMIT_BYTES || `O limite é de ${WEB_UPLOAD_LIMIT_MB} MB.`;
}
