import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiLock } from "react-icons/fi";

import { Button } from "~/components/atoms/Button";
import { Alert } from "~/components/atoms/page/Alert";
import { SectionCard } from "~/components/molecules/SectionCard";
import { ControlledPasswordField } from "~/components/molecules/controlled/ControlledPasswordField";
import { useChangePassword } from "~/hooks/profile/useChangePassword";
import {
  existingPasswordMaxLengthRule,
  newPasswordRules,
  validatePasswordConfirmation,
} from "~/utils/authInputValidation";

interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function ProfilePasswordForm() {
  const { loading, handleChangePassword } = useChangePassword();
  const [formError, setFormError] = useState<string | null>(null);
  const [changed, setChanged] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { isDirty, isSubmitting },
  } = useForm<PasswordFormValues>({
    mode: "onBlur",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");

  async function submit(values: PasswordFormValues) {
    setFormError(null);
    setChanged(false);

    const result = await handleChangePassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });

    if (result.success) {
      reset();
      setChanged(true);
      return;
    }

    let hasFieldError = false;

    if (result.fieldErrors) {
      for (const [field, message] of Object.entries(result.fieldErrors)) {
        if (
          field === "currentPassword" ||
          field === "newPassword" ||
          field === "confirmPassword"
        ) {
          setError(field, { message });
          hasFieldError = true;
        }
      }
    }

    setFormError(hasFieldError ? null : result.message);
  }

  const submitting = loading || isSubmitting;

  return (
    <SectionCard
      title="Alterar senha"
      description="Use uma senha forte que você não utilize em outros serviços."
      icon={FiLock}
    >
      <form
        className="flex flex-col gap-6"
        onSubmit={handleSubmit(submit)}
        noValidate
      >
        <ControlledPasswordField
          id="profile-current-password"
          name="currentPassword"
          label="Senha atual"
          placeholder="Digite sua senha atual"
          control={control}
          rules={{
            required: "A senha atual é obrigatória.",
            maxLength: existingPasswordMaxLengthRule,
          }}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <ControlledPasswordField
            id="profile-new-password"
            name="newPassword"
            label="Nova senha"
            placeholder="Digite a nova senha"
            control={control}
            rules={{
              ...newPasswordRules,
              required: "A nova senha é obrigatória.",
            }}
          />

          <ControlledPasswordField
            id="profile-confirm-password"
            name="confirmPassword"
            label="Confirmar nova senha"
            placeholder="Repita a nova senha"
            control={control}
            rules={{
              required: "A confirmação de senha é obrigatória.",
              validate: (value) => validatePasswordConfirmation(value, newPassword),
            }}
          />
        </div>

        {formError && <Alert message={formError} type="error" />}

        {changed && !isDirty && !formError && (
          <Alert message="Senha alterada com sucesso." type="success" />
        )}

        <div className="flex justify-end">
          <div className="w-full sm:w-56">
            <Button
              type="submit"
              label={submitting ? "Alterando..." : "Alterar senha"}
              disabled={submitting}
            />
          </div>
        </div>
      </form>
    </SectionCard>
  );
}
