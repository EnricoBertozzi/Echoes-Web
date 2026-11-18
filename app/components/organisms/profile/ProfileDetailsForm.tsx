import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiUser } from "react-icons/fi";

import { Button } from "~/components/atoms/Button";
import { Alert } from "~/components/atoms/page/Alert";
import { SectionCard } from "~/components/molecules/SectionCard";
import { ControlledEmailField } from "~/components/molecules/controlled/ControlledEmailField";
import { ControlledTextField } from "~/components/molecules/controlled/ControlledTextField";
import { useAuth } from "~/context/AuthContext";
import { useUpdateProfile } from "~/hooks/profile/useUpdateProfile";

interface ProfileFormValues {
  name: string;
  email: string;
}

export function ProfileDetailsForm() {
  const { user } = useAuth();
  const { loading, handleUpdateProfile } = useUpdateProfile();
  const [formError, setFormError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isDirty, isSubmitting },
  } = useForm<ProfileFormValues>({
    mode: "onBlur",
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
    },
  });

  // Mantém o formulário sincronizado quando o usuário é atualizado no contexto
  // (por exemplo, depois de salvar ou de restaurar a sessão).
  useEffect(() => {
    if (user) {
      reset({ name: user.name, email: user.email });
    }
  }, [user, reset]);

  if (!user) return null;

  async function submit(values: ProfileFormValues) {
    setFormError(null);
    setSaved(false);

    const result = await handleUpdateProfile(values);

    if (result.success) {
      setSaved(true);
      return;
    }

    let hasFieldError = false;

    if (result.fieldErrors) {
      for (const [field, message] of Object.entries(result.fieldErrors)) {
        if (field === "name" || field === "email") {
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
      title="Dados pessoais"
      description="Mantenha suas informações de identificação atualizadas."
      icon={FiUser}
    >
      <form
        className="flex flex-col gap-6"
        onSubmit={handleSubmit(submit)}
        noValidate
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <ControlledTextField
            id="profile-name"
            name="name"
            label="Nome"
            placeholder="Digite seu nome"
            control={control}
            rules={{
              required: "O nome é obrigatório.",
            }}
          />

          <ControlledEmailField
            id="profile-email"
            name="email"
            label="E-mail"
            placeholder="Digite seu e-mail"
            control={control}
            rules={{
              required: "O e-mail é obrigatório.",
            }}
          />
        </div>

        {formError && <Alert message={formError} type="error" />}

        {saved && !isDirty && !formError && (
          <Alert message="Dados atualizados com sucesso." type="success" />
        )}

        <div className="flex justify-end">
          <div className="w-full sm:w-56">
            <Button
              type="submit"
              label={submitting ? "Salvando..." : "Salvar alterações"}
              disabled={!isDirty || submitting}
            />
          </div>
        </div>
      </form>
    </SectionCard>
  );
}
