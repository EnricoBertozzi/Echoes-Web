export const EMAIL_MAX_LENGTH = 255;
export const EXISTING_PASSWORD_MAX_LENGTH = 1024;
export const NEW_PASSWORD_MAX_BYTES = 72;
export const VERIFICATION_CODE_LENGTH = 6;
export const VERIFICATION_CODE_PATTERN = /^[0-9]{6}$/;

export const emailMaxLengthRule = {
  value: EMAIL_MAX_LENGTH,
  message: `O e-mail deve ter até ${EMAIL_MAX_LENGTH} caracteres`,
};

export const existingPasswordMaxLengthRule = {
  value: EXISTING_PASSWORD_MAX_LENGTH,
  message: `A senha deve ter até ${EXISTING_PASSWORD_MAX_LENGTH} caracteres`,
};

const MIN_NEW_PASSWORD_LENGTH = 8;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+=!]).+$/u;
const utf8 = new TextEncoder();

export function validatePasswordSize(value: string) {
  return (value.length <= NEW_PASSWORD_MAX_BYTES && utf8.encode(value).length <= NEW_PASSWORD_MAX_BYTES)
    || `A senha deve ter até ${NEW_PASSWORD_MAX_BYTES} bytes em UTF-8. Acentos e emojis podem ocupar mais de um byte.`;
}

export const newPasswordRules = {
  required: "Senha obrigatória",
  validate(value: string) {
    if ([...value].length < MIN_NEW_PASSWORD_LENGTH) {
      return `A senha deve ter no mínimo ${MIN_NEW_PASSWORD_LENGTH} caracteres`;
    }

    const size = validatePasswordSize(value);
    if (size !== true) return size;

    return passwordPattern.test(value)
      || "A senha deve conter maiúscula, minúscula, número e um destes símbolos: @ # $ % ^ & + = !";
  },
};

export function validatePasswordConfirmation(value: string, password: string) {
  const size = validatePasswordSize(value);
  if (size !== true) return size;

  return value === password || "As senhas não são iguais";
}
